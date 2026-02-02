import { Lexend_Tera, Space_Grotesk, Inter, JetBrains_Mono, Outfit } from 'next/font/google';

export const lexendTera = Lexend_Tera({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lexend-tera',
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-grotesk',
});

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains',
});

export const outfit = Outfit({

  subsets: ['latin'],

  weight: ['400', '500', '600', '700'],

  variable: '--font-outfit',

});