// setup-tailwind.mjs
import fs from 'fs';

// tailwind.config.js
const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;

// postcss.config.js
const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
`;

// Write the files
fs.writeFileSync('tailwind.config.js', tailwindConfig);
fs.writeFileSync('postcss.config.js', postcssConfig);

console.log('Tailwind and PostCSS config files created successfully.');
