import { Lexend_Tera } from 'next/font/google';

export const lexendTera = Lexend_Tera({
  subsets: ['latin'], // Or other subsets you need
  weight: ['400', '700'], // Specify weights you'll use (e.g., normal and bold)
  variable: '--font-lexend-tera', // Optional: for CSS variables
});
