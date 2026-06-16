/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      keyframes: {
        lumoraLogo: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },

        loadingMove: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        lumoraLogo: "lumoraLogo 1.2s ease-out forwards",
        loadingMove: "loadingMove 1.2s linear infinite",
      },
    },
  },
  plugins: [],
};
