(async () => {
    await Bun.build({
        entrypoints: ['./src/index.ts'],
        minify: {
            whitespace: true,
            syntax: true,
            identifiers: true,
        },
        outdir: './dist',
        target: 'bun',
        define: {
            'process.env.NODE_ENV': JSON.stringify('production'),
        },
    })
})()
