import { Elysia } from 'elysia'
import { describe, expect, it } from 'vitest'

import { frontendRouter } from '~/modules/frontend/frontend.controller'
import { createCookieSessionApiLayer } from '~/plugins/api-stack'
import { createUserAuthGuard } from '~/plugins/auth'
import { API_CODE } from '~/types/api-code'

import { requestApp } from './helpers/api-client'
import { createTestApp } from './helpers/test-app'
import { getTestFixtures, loginUserViaApi } from './helpers/test-data'

const frontendApp = createTestApp(frontendRouter)
const protectedApp = createTestApp(
    new Elysia({ prefix: '/api/frontend' })
        .use(createCookieSessionApiLayer())
        .use(createUserAuthGuard())
        .post('/comment/insert', () => ({ ok: 1 })),
)

describe('用户鉴权守卫', () => {
    it('已登录访问受保护路由返回 200', async () => {
        const fixtures = await getTestFixtures()
        const userCookie = await loginUserViaApi(
            options => requestApp(frontendApp, options),
            fixtures,
        )

        const { json } = await requestApp(protectedApp, {
            method: 'POST',
            path: '/api/frontend/comment/insert',
            cookie: userCookie,
            body: {
                id: fixtures.article.id,
                content: '鉴权测试',
            },
        })

        expect(json.code).toBe(API_CODE.OK)
        expect(json.data).toEqual({ ok: 1 })
    })
})
