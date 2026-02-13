/** @type {import('tailwindcss').Config} */
export default {
    // CRITICAL: Configure the 'content' array to tell Tailwind which files to scan
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // <-- Ensure this path is correct for your React components
    ],
    theme: {
    extend: {
      colors: {
        primary: "#1B2A57",
        secondary: "#3B5C91",
        accent: "#FF6A4A",
        neutral: "#6D7A8A",
        light: "#F5F7FA",
      },
      fontFamily: {
        body: ["Inter", "Poppins", "system-ui", "sans-serif"],  
        heading: ["Poppins", "system-ui", "sans-serif"],        
      },
    },
  },
    plugins: [],

}