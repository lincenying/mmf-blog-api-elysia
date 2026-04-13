import type { Target } from 'bun'

(async () => {
    await Bun.build({
        entrypoints: ['./src/index.ts'],
        compile: {
            // tsconfig.json 和 package.json 默认禁用
            autoloadTsconfig: true, // 启用 tsconfig.json 加载
            autoloadPackageJson: true, // 启用 package.json 加载

            // .env 和 bunfig.toml 默认启用
            autoloadDotenv: false, // 禁用 .env 加载
            autoloadBunfig: false, // 禁用 bunfig.toml 加载
            outfile: './server-mac',
        },
        minify: {
            whitespace: true,
            syntax: true,
            identifiers: true,
        },
        target: 'bun-darwin-x64' as Target,
        define: {
            'process.env.NODE_ENV': JSON.stringify('production'),
        },
    })
})()
