export default {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // Include paths to your component files
  ],
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 1s ease-out forwards',
        fadeInButton: 'fadeInButton 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: 0,
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        fadeInButton: {
          '0%': {
            opacity: 0,
            transform: 'scale(0.8)',
          },
          '100%': {
            opacity: 1,
            transform: 'scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
}
