import heroUINativePlugin from 'heroui-native/tailwind-plugin';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Your app files
    "./src/**/*.{js,jsx,ts,tsx}",
    // HeroUI Native
    "./node_modules/heroui-native/lib/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'light-grey': {
          light: '#f5f5f5',
          dark: '#1a1a1a',
        },
        'page-bg': {
          light: '#f5f5f5',
          dark: '#000000',
        },
        'asset-icon': '#2864f0',
      },
      fontFamily: {
        'orbitron': ['Orbitron_400Regular'],
        'orbitron-medium': ['Orbitron_500Medium'],
        'orbitron-semibold': ['Orbitron_600SemiBold'],
        'orbitron-bold': ['Orbitron_700Bold'],
        'orbitron-extrabold': ['Orbitron_800ExtraBold'],
        'orbitron-black': ['Orbitron_900Black'],
        'inter': ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
      },
    },
  },
  plugins: [heroUINativePlugin],
}