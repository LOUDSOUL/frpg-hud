import { defineConfig } from 'vite';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const outputFilename = 'frpg-hud.user.js';

function generateMetadata() {
    const metadataPath = join(__dirname, 'src', 'metadata.js');
    const metadata = readFileSync(metadataPath, 'utf8');
    
    if (process.env.GITHUB_ACTIONS) {
        const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
        const commitDate = execSync('git log -1 --format=%cd --date=short', { encoding: 'utf8' }).trim();
        const version = `${commitDate}-${commitHash}`;
        return metadata.replace(/(@version\s+)[^\n]+/, `$1${version}`);
    }
    
    return metadata;
}

export default defineConfig(({ mode }) => ({
    define: {
        __TEST_MODE: mode === "test",
    },
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

            // Otherwise the header gets added multiple times
            if (mode === "test") return;

            const filePath = join(__dirname, 'dist', outputFilename);
            const content = readFileSync(filePath, 'utf8');
            const dynamicMetadata = generateMetadata();

            writeFileSync(filePath, dynamicMetadata + '\n\n' + content);
        }
    }],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./test/setup.js'],
    },
}));
