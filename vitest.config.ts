import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    resolve: {
        alias: {
            '~': path.resolve(__dirname, './src'),
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        environment: 'node',
        setupFiles: ['./tests/setup.ts', './tests/helpers/test-data.ts'],
        include: ['tests/**/*.test.ts'],
        testTimeout: 30000,
        hookTimeout: 30000,
    },
})
