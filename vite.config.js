import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import svgr from "vite-plugin-svgr";

export default defineConfig({
   plugins: [
        laravel({
            input: ['resources/js/main.tsx'],
            refresh: true,
            buildDirectory: 'build',
        }),
        react(),
        svgr({
            svgrOptions: {
              icon: true,
              exportType: "named",
              namedExport: "ReactComponent",
            },
        }),
    ],
    
    build: {
        manifest: 'manifest.json',
        outDir: 'public/build',
        emptyOutDir: true,
        rollupOptions: {
            output: {
                manualChunks: undefined,
            }
        }
    }
});