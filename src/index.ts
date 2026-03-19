import { mkdir } from 'node:fs/promises'
import { Elysia } from 'elysia'

import { config } from '@/config'
import { logger } from '@/utils/logger'
import { accessLoggerMiddleware } from './middleware/access-logger'
import { responseWrapperMiddleware } from './middleware/response-wrapper'
import { createStaticConfig, createSwaggerConfig } from './plugins'
import { adminRouter } from './routes/admin'
import { backendRouter } from './routes/backend'
import { frontendRouter } from './routes/frontend'
import { uploadRouter } from './routes/upload'
import { ApiError } from './types'

(async () => {
    const UPLOAD_DIR = './uploads'
    await mkdir(UPLOAD_DIR, { recursive: true })
})()

const app = new Elysia({
    serve: {
        maxRequestBodySize: 1024 * 1024 * 256, // 256MB
    },
})
    .use(createStaticConfig())
    .use(createSwaggerConfig())
    .use(accessLoggerMiddleware)
    .use(responseWrapperMiddleware)
    .use(frontendRouter)
    .use(backendRouter)
    .use(uploadRouter)
    .use(adminRouter)
    .all('/sm/*', () => {
        return ''
    })
    .all('/*', () => {
        throw new ApiError(404, 'Not Found')
    })
    .listen(config.server.port)

// 获取正确的访问信息
logger.info(`🚀 服务器运行在 http://${app.server?.hostname}:${app.server?.port}`)
logger.info(`📋 API文档地址: http://${app.server?.hostname}:${app.server?.port}${config.swagger.path}`)
