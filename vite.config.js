import { defineConfig } from 'vite';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';


const outputFilename = 'frpg-hud.user.js';

const metadataPath = join(__dirname, 'src', 'metadata.js');
const metadata = readFileSync(metadataPath, 'utf8');

export default defineConfig({
    build: {
        lib: {
            entry: 'src/main.js',
            formats: ['iife'],
            name: 'UserscriptBundle',
            fileName: () => outputFilename,
        },
        outDir: 'dist',
        minify: false,
        rollupOptions: {
            output: {
                compact: false,
            },
        },
    },
    plugins: [{
        name: 'userscript-metadata',
        closeBundle() {
            // For some ******* reason vite was stripping out the header **every time**
            // Doesn't matter if it's a `banner` in rollupOptions
            // Or a plugin that adds it using renderChunk
            // The only way I found which worked:

            const filePath = join(__dirname, 'dist', outputFilename);
            const content = readFileSync(filePath, 'utf8');

            writeFileSync(filePath, metadata + '\n\n' + content);
        }
    }],
});
