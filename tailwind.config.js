/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        PipelineCardsShadow: "0px 1px 2px 0px rgba(62, 72, 84, 0.14)",

      },
    },
  },
  plugins: [],
}
