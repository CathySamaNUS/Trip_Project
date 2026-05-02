/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#fdfaf3',
        paper2: '#fff8ec',
        rose: '#ef7f8f',
        rose2: '#f48c9b',
        cream: '#fff2c8',
        moss: '#c8d8b8',
        sky: '#d8eaf5',
        ink: '#3a3530',
        muted: '#8a7f72'
      },
      fontFamily: {
        hand: ['"Ma Shan Zheng"', '"Kaiti SC"', '"STKaiti"', 'serif'],
        serifc: ['"Noto Serif SC"', 'Georgia', 'serif'],
        body: ['"PingFang SC"', '"Helvetica Neue"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        paper: '0 4px 14px rgba(160,140,110,0.15)',
        soft: '0 2px 8px rgba(160,140,110,0.10)'
      },
      backgroundImage: {
        'paper-grain':
          "radial-gradient(rgba(180,160,120,0.08) 1px, transparent 1px), radial-gradient(rgba(180,160,120,0.05) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
}
