import { Lexend_Tera, Space_Grotesk, Inter, JetBrains_Mono, Outfit, Open_Sans, Anonymous_Pro } from 'next/font/google';

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

export const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-open-sans',
});

export const anonymousPro = Anonymous_Pro({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-anonymous-pro',
});