import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js', // Para extender los matchers de jest-dom
    server: {
      deps: {
        inline: [
          '@mui/material',
          'react-transition-group',
          '@emotion/react',
          '@emotion/styled'
        ],
      },
    },
  },
})