/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        sidebar: {
          dark: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          hover: '#1e293b',
        },
        badge: {
          networkBg: '#eff6ff',
          networkText: '#2563eb',
          hardwareBg: '#f5f3ff',
          hardwareText: '#7c3aed',
          accountBg: '#ecfdf5',
          accountText: '#059669',
          softwareBg: '#fffbeb',
          softwareText: '#d97706',
          itBg: '#eff6ff',
          itText: '#3b82f6',
          othersBg: '#f1f5f9',
          othersText: '#475569',
          highBg: '#fef2f2',
          highText: '#ef4444',
          mediumBg: '#fffbeb',
          mediumText: '#f59e0b',
          lowBg: '#f0fdf4',
          lowText: '#10b981',
          openBg: '#fef2f2',
          openText: '#ef4444',
          inProgressBg: '#fffbeb',
          inProgressText: '#f59e0b',
          resolvedBg: '#f0fdf4',
          resolvedText: '#10b981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
