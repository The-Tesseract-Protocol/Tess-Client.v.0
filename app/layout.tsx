import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { lexendTera, spaceGrotesk, inter, jetbrainsMono, outfit } from "./components/Fonts";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tesseract",
  description: "4D Privacy On 2D Ledger",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"   className={`${geistSans.variable} ${geistMono.variable} ${lexendTera.variable} ${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} ${outfit.variable}`}
>
      <body className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
