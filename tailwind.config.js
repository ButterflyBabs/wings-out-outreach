/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // LifeCharter Brand Palette
        'deep-indigo': '#1F315B',
        'royal-plum': '#5E3B6C',
        'sacred-teal': '#2E7C83',
        'soft-lavender': '#CDBED6',
        'warm-gold': '#D4AF63',
        'ivory-light': '#F6F1E8',
        'soft-taupe': '#B9A9A9',
        // Semantic colors
        'priority-a': '#4caf50',
        'priority-b': '#ffc107',
        'priority-c': '#ff9800',
        'priority-d': '#9e9e9e',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
