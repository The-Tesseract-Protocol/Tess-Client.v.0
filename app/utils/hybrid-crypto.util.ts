/**
 * Hybrid Encryption Utilities for Tesseract Protocol (Browser-Compatible)
 *
 * Uses AES-256-CBC + RSA hybrid encryption for all payloads
 * Supports up to ~133 recipients per withdrawal
 *
 * Browser-compatible version using Web Crypto API
 */

enum EncryptionMode {
  HYBRID_AES = 'hybrid-aes',
}

interface HybridEncryptionResult {
  encrypted: string; // base64 encoded
  mode: EncryptionMode;
  metadata: {
    keySize: number;
    payloadSize: number;
    recipients: number;
  };
}

export class HybridCryptoUtil {
  /**
   * Encrypt payload using hybrid AES-256-CBC + RSA encryption
   * Always uses hybrid mode for maximum capacity (up to ~133 recipients)
   */
  static async encryptPayload(
    recipients: Record<string, string>,
    publicKeyPem: string
  ): Promise<HybridEncryptionResult> {
    const payloadStr = JSON.stringify(recipients);
    const payloadSize = new TextEncoder().encode(payloadStr).length;
    const recipientCount = Object.keys(recipients).length;

    // Always use hybrid AES encryption
    const aesResult = await this.encryptHybridAES(payloadStr, publicKeyPem);

    return {
      encrypted: aesResult.encrypted,
      mode: EncryptionMode.HYBRID_AES,
      metadata: {
        keySize: aesResult.keySize,
        payloadSize,
        recipients: recipientCount,
      },
    };
  }

  // ============================================================================
  // Hybrid AES-256-CBC + RSA Encryption
  // ============================================================================

  private static async encryptHybridAES(
    payloadStr: string,
    publicKeyPem: string
  ): Promise<{ encrypted: string; keySize: number }> {
    const payloadBuffer = new TextEncoder().encode(payloadStr);

    // Generate random AES key (256 bits) and IV (128 bits for CBC)
    const aesKey = crypto.getRandomValues(new Uint8Array(32));
    const iv = crypto.getRandomValues(new Uint8Array(16));

    // Import AES key for encryption
    const aesKeyObject = await crypto.subtle.importKey(
      'raw',
      aesKey,
      { name: 'AES-CBC' },
      false,
      ['encrypt']
    );

    // Encrypt payload with AES-256-CBC
    const encryptedPayload = await crypto.subtle.encrypt(
      { name: 'AES-CBC', iv },
      aesKeyObject,
      payloadBuffer
    );

    // Encrypt AES key with RSA
    const publicKey = await this.importRSAPublicKey(publicKeyPem);
    const encryptedKeyBuffer = await crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey,
      aesKey
    );

    const encryptedKey = new Uint8Array(encryptedKeyBuffer);

    // Build wire format: [keySize(4)] + [encryptedKey] + [iv(16)] + [encrypted]
    const keySize = new Uint8Array(4);
    const dataView = new DataView(keySize.buffer);
    dataView.setUint32(0, encryptedKey.length, false); // big-endian

    const wireFormat = new Uint8Array(
      4 + encryptedKey.length + 16 + encryptedPayload.byteLength
    );

    let offset = 0;
    wireFormat.set(keySize, offset);
    offset += 4;
    wireFormat.set(encryptedKey, offset);
    offset += encryptedKey.length;
    wireFormat.set(iv, offset);
    offset += 16;
    wireFormat.set(new Uint8Array(encryptedPayload), offset);

    return {
      encrypted: this.arrayBufferToBase64(wireFormat.buffer),
      keySize: encryptedKey.length,
    };
  }

  // ============================================================================
  // Helper Functions
  // ============================================================================

  /**
   * Import RSA public key from PEM format
   */
  private static async importRSAPublicKey(publicKeyPem: string): Promise<CryptoKey> {
    // Handle escaped newlines from env variable
    publicKeyPem = publicKeyPem.replace(/\\n/g, '\n');

    // Parse PEM to get the key
    const pemContents = publicKeyPem
      .replace('-----BEGIN PUBLIC KEY-----', '')
      .replace('-----END PUBLIC KEY-----', '')
      .replace(/\s/g, '');

    const keyData = this.base64ToArrayBuffer(pemContents);

    // Import the key
    return await crypto.subtle.importKey(
      'spki',
      keyData,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      false,
      ['encrypt']
    );
  }

  /**
   * Convert ArrayBuffer to base64 string
   */
  private static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Convert base64 string to ArrayBuffer
   */
  private static base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Calculate maximum recipients for hybrid encryption
   * Returns ~133 recipients (10KB limit)
   */
  static calculateMaxRecipients(): number {
    // Assuming average recipient entry is ~75 bytes (56-char address + 10-char amount + JSON overhead)
    const avgRecipientSize = 75;
    return Math.floor(10000 / avgRecipientSize); // ~133 recipients (10KB limit)
  }

  /**
   * Estimate encrypted payload size for given recipients
   * Returns size in bytes for hybrid AES-256-CBC + RSA encryption
   */
  static estimateEncryptedSize(recipientCount: number): number {
    const avgRecipientSize = 75;
    const payloadSize = recipientCount * avgRecipientSize + 50; // JSON overhead
    return 4 + 256 + 16 + payloadSize; // Headers + encrypted payload (AES-CBC)
  }
}
