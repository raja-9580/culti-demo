import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0f1419',
        'dark-surface': '#151d26',
        'dark-surface-light': '#1a2535',
        'accent-green': '#22c55e',
        'accent-earth': '#a16207',
        'accent-leaf': '#10b981',
        'accent-sky': '#06b6d4',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
export default config
