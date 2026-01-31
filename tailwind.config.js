/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lexend: ["var(--font-lexend-tera)"],
        space: ["var(--font-space-grotesk)"],
        inter: ["var(--font-inter)"],
        mono: ["var(--font-jetbrains)"],
        outfit: ["var(--font-outfit)"],
      },
    },
  },
  plugins: [],
};
