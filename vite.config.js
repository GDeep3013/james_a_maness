import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import svgr from "vite-plugin-svgr";

export default defineConfig({
    plugins: [
        laravel({
            input: [
                // 'resources/sass/app.scss',
                'resources/js/main.tsx',
            ],
            refresh: true,
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
        outDir: 'public/build',
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
            output: {
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
            },
        },
    },
});