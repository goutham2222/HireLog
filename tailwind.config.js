/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--color-canvas)',
        surface: 'var(--color-surface)',
        ink: 'var(--color-ink)',
        muted: 'var(--color-muted)',
        line: 'var(--color-line)',
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          soft: 'var(--color-accent-soft)',
        },
        status: {
          applied: 'var(--color-applied)',
          interview: 'var(--color-interview)',
          accepted: 'var(--color-accepted)',
          rejected: 'var(--color-rejected)',
          pending: 'var(--color-pending)',
        },
      },
    },
  },
  plugins: [],
}
