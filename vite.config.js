import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    // Enable minification with esbuild (faster than terser)
    minify: 'esbuild',
    // Enable tree shaking
    rollupOptions: {
      output: {
        // Manual chunks for better code splitting
        manualChunks: {
          's3-service': ['./src/services/s3Service.js'],
          'ui': ['./src/ui/renderer.js', './src/ui/state.js'],
        },
      },
    },
    // Target modern browsers for smaller bundle
    target: 'es2015',
    // Enable source maps for debugging (set to true for development)
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [],
  },
})
