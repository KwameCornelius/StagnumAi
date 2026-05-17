import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      // HMR is disabled when DISABLE_HMR=true (e.g. inside an agent harness
      // that's editing files; file watching causes flicker).
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      // Split large vendor deps into their own chunks so the initial
      // bundle isn't one ~1MB blob. Charts/motion/icons especially are
      // big and only used on the dashboard — splitting them lets the
      // browser cache them independently and parallelize downloads.
      rollupOptions: {
        output: {
          // Function form rather than the object form because React 19's
          // automatic JSX runtime imports `react/jsx-runtime` (not bare
          // `react`), which the object-form matcher misses — leaving an
          // empty `react` chunk and dumping react into the main bundle.
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (id.match(/[\\/]node_modules[\\/]react(-dom)?[\\/]/)) return 'react';
            if (id.includes('recharts')) return 'charts';
            if (id.match(/[\\/]node_modules[\\/]motion[\\/]/)) return 'motion';
            if (id.includes('@supabase')) return 'supabase';
            if (id.includes('lucide-react')) return 'icons';
            return undefined; // everything else goes to the main vendor chunk
          },
        },
      },
      // Each manual chunk should be comfortably under 500kB after
      // minification; if a chunk ever blows past, that's a real signal
      // we need to split further, not silence the warning.
      chunkSizeWarningLimit: 500,
    },
  };
});
