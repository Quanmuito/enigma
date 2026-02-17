import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            app: fileURLToPath(new URL('./src/app', import.meta.url)),
            components: fileURLToPath(new URL('./src/components', import.meta.url)),
            constants: fileURLToPath(new URL('./src/constants', import.meta.url)),
            contexts: fileURLToPath(new URL('./src/contexts', import.meta.url)),
            hooks: fileURLToPath(new URL('./src/hooks', import.meta.url)),
            libs: fileURLToPath(new URL('./src/libs', import.meta.url)),
            styles: fileURLToPath(new URL('./src/styles', import.meta.url)),
            types: fileURLToPath(new URL('./src/types', import.meta.url)),
        },
    },
});
