/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", // blue tone for app accent
        secondary: "#F59E0B",
        light: "#F3F4F6",
        dark: "#111827",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 15px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
