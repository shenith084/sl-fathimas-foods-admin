import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Primary Colors
        saffron: {
          DEFAULT: "#D98C1F",
          light: "#E8B04A",
          dark: "#B8740F",
        },
        olive: {
          DEFAULT: "#556B4F",
          light: "#7A9B76",
          lighter: "#A3B18A",
          dark: "#3D5038",
        },
        premium: {
          black: "#1F1F1F",
        },
        // Background Colors
        cream: {
          DEFAULT: "#FAF7F2",
          soft: "#F4EFE6",
        },
        // Text Colors
        charcoal: "#222222",
        "soft-gray": "#666666",
        "light-gray": "#9CA3AF",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Playfair Display", "serif"],
        script: ["var(--font-script)", "Dancing Script", "cursive"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #FAF7F2 0%, #F4EFE6 50%, #FAF7F2 100%)",
        "olive-gradient":
          "linear-gradient(135deg, #556B4F 0%, #3D5038 100%)",
        "saffron-gradient":
          "linear-gradient(135deg, #D98C1F 0%, #B8740F 100%)",
        "footer-gradient":
          "linear-gradient(180deg, #1F1F1F 0%, #111111 100%)",
      },
      boxShadow: {
        card: "0 2px 20px rgba(0,0,0,0.08)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.15)",
        product: "0 4px 24px rgba(85,107,79,0.15)",
        glow: "0 0 30px rgba(217,140,31,0.25)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-left": "slideLeft 0.4s ease-out forwards",
        "slide-right": "slideRight 0.4s ease-out forwards",
        "bounce-slow": "bounce 3s infinite",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
