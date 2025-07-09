// tailwind.themes.ts
import { type Config } from 'tailwindcss';

const themes: Partial<Config['theme']> = {
  colors: {
    primary: { DEFAULT: '#3B82F6', 20: '#7CBAFD' },
    secondary: { DEFAULT: '#9333EA', 50: '#CDF0F6' },
    grey: {
      DEFAULT: '#414141',
      50: '#D9D9D9',
      100: '#D5D5D8',
      200: '#EBEBEB',
      300: '#9C9C9C',
      400: '#1212124D',
    },

    //     primary: { DEFAULT: '#3B82F6', 50: '#D8E6FD80' },
    //     secondary: { DEFAULT: '#9333EA' },
    //     grey: { DEFAULT: '#414141' },

    warning: {
      50: '#FDECCE',
      300: '#F8BE5C',
      400: '#F7AE34',
    },
    error: {
      DEFAULT: '#FF3B30',
      100: '#FFCECB',
      600: '#FF170A',
    },
    success: {
      100: '#CCF2D5',
      600: '#34C759',
    },

    black: {
      DEFAULT: '#000000',
      20: '#ABB9C9',
      50: '#7E7E7E',
      100: '#010C17',
    },

    neutral: {
      50: '#D9D9D9',
      100: '#F3F3F3',

      300: '#808080',

      700: '#2B2B2B',
      800: '#202020',
      900: '#161616',
    },
    accent: {
      100: '#06B6D4',
      200: '#CB00A3',
      300: '#D47B06',
      400: '#D40606',
    },

    main: { DEFAULT: '#FAFAFA', 50: '#D8E6FD', 100: '#F9FAFB' },

    //     main: { DEFAULT: '#FAFAFA', 50: '#D8E6FD', 100: '#D9D9D9' },

    green: {
      DEFAULT: '#34C759',
      100: '#CCF2D5',
      200: '#4BD06D',
    },
  },

  borderRadius: {
    xl: '1rem',
    '2xl': '1.5rem',
  },

  spacing: {
    72: '18rem',
    84: '21rem',
    96: '24rem',
  },
};

export default themes;
