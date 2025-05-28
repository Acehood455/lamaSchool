import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      colors: {
        Sky: '#c3ebfa',
        SkyLight: '#edf9fd',
        Purple: '#cfceff',
        PurpleLight: '#f1f0ff',
        Yellow: '#fae27c',
        YellowLight: '#fefce8',
      }
    },
  },
  plugins: [],
};
export default config;
