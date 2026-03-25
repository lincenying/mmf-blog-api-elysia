import { mkdir } from 'node:fs/promises'
import { serverTiming } from '@elysiajs/server-timing'
import { Elysia, file } from 'elysia'

import { config } from '~/config'
import { logger } from '~/utils/logger'
import { accessLoggerMiddleware } from './middleware/access-logger'
import { createStaticConfig, createSwaggerConfig } from './plugins'
import { adminRouter } from './routes/admin'
import { backendRouter } from './routes/backend'
import { frontendRouter } from './routes/frontend'
import { jwtRouter } from './routes/jwt'
import { sqliteRouter } from './routes/sqlite'
import { uploadRouter } from './routes/upload'
import { wsRouter } from './routes/ws'

(async () => {
    const UPLOAD_DIR = './uploads'
    await mkdir(UPLOAD_DIR, { recursive: true })
})()

const app = new Elysia({
    serve: {
        maxRequestBodySize: 1024 * 1024 * 256, // 256MB
    },
})
    .use(serverTiming())
    .use(createStaticConfig())
    .use(createSwaggerConfig())
    .use(accessLoggerMiddleware)
    .use(wsRouter)
    .use(frontendRouter)
    .use(backendRouter)
    .use(uploadRouter)
    .use(adminRouter)
    .use(jwtRouter)
    .use(sqliteRouter)
    .get('/favicon.ico', file('./public/favicon.ico'))
    .get('/robots.txt', file('./public/robots.txt'))
    .all('/sm/*', () => '')
    .all('/*', () => 'Page Not Found')
    .listen(config.server.port)

// 获取正确的访问信息
logger.info(`🚀 服务器运行在 http://${app.server?.hostname}:${app.server?.port}`)
logger.info(`📋 API文档地址: http://${app.server?.hostname}:${app.server?.port}${config.swagger.path}`)
