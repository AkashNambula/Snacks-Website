/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#3D2314',      // Premium Dark Brown
          darker: '#2A170C',    // Near Black Brown
          light: '#8B5A2B',     // Golden Brown
          bronze: '#CD7F32',    // Rich Bronze Accent
          cream: '#FFFDD0',     // Soft Cream
          creamlight: '#FAF9F6',// Off White
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
