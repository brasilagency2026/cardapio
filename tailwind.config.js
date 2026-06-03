/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./convex/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FCEBEB",
          100: "#F9D7D7",
          200: "#F2AFAF",
          300: "#EB8787",
          400: "#E45F5F",
          500: "#E24B4A",
          600: "#C73D3D",
          700: "#A32D2D",
          800: "#7F1E1E",
          900: "#5B1010",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
