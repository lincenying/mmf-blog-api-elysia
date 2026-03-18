/* eslint-disable node/prefer-global/process */
import { staticPlugin } from '@elysiajs/static'
import { Elysia } from 'elysia'

import { adminRouter } from './routes/admin'
import { backendRouter } from './routes/backend'
import { frontendRouter } from './routes/frontend'
import { uploadRouter } from './routes/upload'

const port = process.env.PORT || '4000'

const app = new Elysia({
    serve: {
        maxRequestBodySize: 1024 * 1024 * 256, // 256MB
    },
})
    .use(staticPlugin())
    .use(staticPlugin({
        // 静态文件目录（相对于项目根目录）
        assets: 'uploads', // 默认: 'public'
        // 访问路径前缀
        prefix: '/uploads', // 默认: '/public'
        // 是否在找不到路由时返回 index.html（适用于 SPA）
        indexHTML: false, // 默认: false
        // 自定义响应头
        headers: {
            'Cache-Control': `public, max-age=${3600 * 24 * 30}`, // 30 days
        },
    }))
    .use(frontendRouter)
    .use(backendRouter)
    .use(uploadRouter)
    .use(adminRouter)
    .all('/*', () => {
        return {
            code: 404,
            message: 'Not Found',
            data: null,
        }
    })
    .listen(port)

console.log(
    `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
)
