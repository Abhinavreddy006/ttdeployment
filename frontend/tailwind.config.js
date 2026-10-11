/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        command: {
          950: '#0b1120',
          900: '#111827',
          850: '#172033',
          800: '#1e293b',
          700: '#334155',
        },
        healthcare: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      backgroundImage: {
        'command-gradient': 'radial-gradient(ellipse at top, #172033 0%, #0f172a 38%, #0b1120 100%)',
        'aurora-gradient': 'linear-gradient(115deg, rgba(20, 184, 166, .08), rgba(14, 165, 233, .035), rgba(45, 212, 191, .07))',
        'glass-edge': 'linear-gradient(135deg, rgba(45, 212, 191, .35), rgba(148, 163, 184, .12) 45%, rgba(56, 189, 248, .18))',
      },
      boxShadow: {
        'glow-teal': '0 0 24px rgba(13, 148, 136, .22)',
        'glow-cyan': '0 0 28px rgba(34, 211, 238, .18)',
        'glass': '0 22px 80px -36px rgba(0, 0, 0, .8)',
        'sign-teal': '0 0 15px rgba(13, 148, 136, .4)',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { transform: 'translate3d(-2%, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(2%, -3%, 0) scale(1.08)' },
        },
        'border-glow': {
          '0%, 100%': { opacity: '.45' },
          '50%': { opacity: '.9' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-120%)', opacity: '0' },
          '15%, 80%': { opacity: '1' },
          '100%': { transform: 'translateY(220%)', opacity: '0' },
        },
        'soft-pulse': {
          '0%, 100%': { opacity: '.65', transform: 'scale(.94)' },
          '50%': { opacity: '1', transform: 'scale(1.06)' },
        },
      },
      animation: {
        aurora: 'aurora 18s ease-in-out infinite',
        'border-glow': 'border-glow 2.8s ease-in-out infinite',
        'scan-line': 'scan-line 1.35s ease-in-out infinite',
        'soft-pulse': 'soft-pulse 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
