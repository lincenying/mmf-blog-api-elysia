import { describe, expect, it } from 'vitest'

import { backendRouter } from '~/modules/backend/backend.controller'
import { API_CODE } from '~/types/api-code'

import { requestApp } from './helpers/api-client'
import { createTestApp } from './helpers/test-app'
import { getTestFixtures, loginAdminViaApi } from './helpers/test-data'

const backendApp = createTestApp(backendRouter)

describe('后台接口 /api/backend', () => {
    it('get /category/list 返回分类列表', async () => {
        const fixtures = await getTestFixtures()

        const { status, json } = await requestApp<{ list: unknown[] }>(backendApp, {
            path: '/api/backend/category/list',
        })

        expect(status).toBe(200)
        expect(json.code).toBe(API_CODE.OK)
        expect(Array.isArray(json.data?.list)).toBe(true)
        expect(json.data!.list.length).toBeGreaterThanOrEqual(fixtures.categoryCount)
    })

    it('get /article/list 管理员登录后返回文章列表', async () => {
        const fixtures = await getTestFixtures()
        const adminCookie = await loginAdminViaApi(
            options => requestApp(backendApp, options),
            fixtures,
        )

        const { json } = await requestApp<{ list: unknown[], total: number }>(backendApp, {
            path: '/api/backend/article/list',
            query: { page: '1', limit: '10' },
            cookie: adminCookie,
        })

        expect(json.code).toBe(API_CODE.OK)
        expect(Array.isArray(json.data?.list)).toBe(true)
        expect(typeof json.data?.total).toBe('number')
    })

    it('post /admin/login 登录成功并返回管理员信息', async () => {
        const fixtures = await getTestFixtures()

        const { json } = await requestApp<{ user: string, userid: string, username: string }>(backendApp, {
            method: 'POST',
            path: '/api/backend/admin/login',
            body: {
                username: fixtures.admin.username,
                password: fixtures.admin.password,
            },
        })

        expect(json.code).toBe(API_CODE.OK)
        expect(json.data?.username).toBe(encodeURI(fixtures.admin.username))
        expect(typeof json.data?.user).toBe('string')
    })

    it('get /admin/logout 返回登出结果', async () => {
        const fixtures = await getTestFixtures()
        const adminCookie = await loginAdminViaApi(
            options => requestApp(backendApp, options),
            fixtures,
        )

        const { json } = await requestApp<string>(backendApp, {
            path: '/api/backend/admin/logout',
            cookie: adminCookie,
        })

        expect(json.code).toBe(API_CODE.OK)
        expect(json.data).toBe('退出成功')
    })

    it('未知路由返回 404', async () => {
        const { json } = await requestApp<null>(backendApp, {
            path: '/api/backend/unknown-route',
        })

        expect(json.code).toBe(API_CODE.NOT_FOUND)
        expect(json.message).toBe('接口不存在')
    })
})
