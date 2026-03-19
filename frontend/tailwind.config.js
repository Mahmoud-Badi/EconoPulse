/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-panel': 'var(--bg-panel)',
        'bg-hover': 'var(--bg-hover)',
        'border-default': 'var(--border)',
        'border-bright': 'var(--border-bright)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-dim': 'var(--text-dim)',
        'text-label': 'var(--text-label)',
        'accent-amber': 'var(--accent-amber)',
        'accent-amber-dim': 'var(--accent-amber-dim)',
        'accent-green': 'var(--accent-green)',
        'accent-green-dim': 'var(--accent-green-dim)',
        'accent-red': 'var(--accent-red)',
        'accent-red-dim': 'var(--accent-red-dim)',
        'accent-blue': 'var(--accent-blue)',
        'accent-cyan': 'var(--accent-cyan)',
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Fira Code'", "'Courier New'", 'monospace'],
        display: ["'DM Sans'", 'sans-serif'],
        data: ["'IBM Plex Mono'", 'monospace'],
      },
    },
  },
  plugins: [],
}
