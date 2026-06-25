import type { AnyElysia } from 'elysia'
import { Elysia as ElysiaApp } from 'elysia'

import { createCorsConfig } from '~/plugins/cors'
import { responseWrapperMiddleware } from '~/plugins/response-wrapper'
import { validationSchema } from '~/schema/elysia-schema'

/**
 * 组装带 CORS、校验与统一响应包装的测试用 Elysia 实例。
 * 单独测试 Router 时 scoped 的 responseWrapper 不会作用于外层路由，此处显式补齐。
 */
export function createTestApp(router: AnyElysia) {
    return new ElysiaApp({ name: 'test-app' })
        .use(createCorsConfig())
        .use(validationSchema)
        .use(
            new ElysiaApp({ name: 'test-app-router-shell' })
                .use(responseWrapperMiddleware)
                .use(router),
        )
}
