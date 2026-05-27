/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryTeal: '#0F766E',
        successGreen: '#059669',
        warningAmber: '#F59E0B',
        dangerRed: '#EF4444',
        softMint: '#ECFDF5',
      },
    },
  },
  plugins: [],
}
