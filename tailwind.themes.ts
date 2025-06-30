// tailwind.themes.ts
import { type Config } from "tailwindcss";

const themes: Partial<Config["theme"]> = {
  colors: {
    primary: { DEFAULT: "#3B82F6" },
    secondary: { DEFAULT: "#9333EA" }, // use a valid value
    grey: { DEFAULT: "#414141" },

    warning: {
      50: "#FDECCE",
      400: "#F7AE34",
    },

    black: {
      DEFAULT: "#000000",
    },

    neutral: {
      300: "#808080",
      700: "#2B2B2B",
      900: "#161616",
    },

    main: {
      50: "#D8E6FD",
    },

    green: {
      DEFAULT: "#34C759",
      100: "#CCF2D5",
      200: "#4BD06D",
    },
  },

  borderRadius: {
    xl: "1rem",
    "2xl": "1.5rem",
  },

  spacing: {
    72: "18rem",
    84: "21rem",
    96: "24rem",
  },
};

export default themes;
