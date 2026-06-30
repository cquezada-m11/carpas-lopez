import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "Cambria", "serif"],
        mono: [
          "var(--font-mono)",
          "SFMono-Regular",
          "ui-monospace",
          "Menlo",
          "monospace",
        ],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // --- Tokens de marca Carpas López ---
        ink: {
          DEFAULT: "hsl(var(--ink))",
          deep: "hsl(var(--ink-deep))",
        },
        bone: {
          DEFAULT: "hsl(var(--bone))",
          dark: "hsl(var(--bone-dark))",
          alt: "hsl(var(--bone-alt))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          deep: "hsl(var(--gold-deep))",
          light: "hsl(var(--gold-light))",
        },
      },
      fontSize: {
        // Eyebrow / kicker mono en versalitas (patrón recurrente del diseño)
        eyebrow: ["0.625rem", { lineHeight: "1", letterSpacing: "0.2em" }],
        // Escala display serif (hero / títulos de sección), responsive-friendly
        display: [
          "clamp(2.25rem, 6vw, 3.5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.01em" },
        ],
        "heading-lg": ["clamp(1.75rem, 4vw, 2.5rem)", { lineHeight: "1.12" }],
        heading: ["clamp(1.5rem, 3vw, 1.875rem)", { lineHeight: "1.15" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "2px",
      },
      boxShadow: {
        card: "0 1px 0 0 hsl(var(--border))",
        elevated:
          "0 30px 70px -28px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
