import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { frontendRouter } from '~/modules/frontend/frontend.controller'
import { API_CODE } from '~/types/api-code'

import { requestApp } from './helpers/api-client'
import {
    cleanupVitestComments,
    getTestFixtures,
    loginUserViaApi,
    TEST_COMMENT_MARKER,
} from './helpers/test-data'
import { createTestApp } from './helpers/test-app'

const frontendApp = createTestApp(frontendRouter)

describe('前台接口 /api/frontend', () => {
    beforeEach(async () => {
        const fixtures = await getTestFixtures()
        await cleanupVitestComments(fixtures.article.id, fixtures.user.id)
    })

    afterEach(async () => {
        const fixtures = await getTestFixtures()
        await cleanupVitestComments(fixtures.article.id, fixtures.user.id)
    })

    it('GET /trending 返回热门文章', async () => {
        const { json } = await requestApp<{ list: Array<{ _id: string, title: string }> }>(frontendApp, {
            path: '/api/frontend/trending',
        })

        expect(json.code).toBe(API_CODE.OK)
        expect(Array.isArray(json.data?.list)).toBe(true)
        expect(json.data!.list.length).toBeGreaterThan(0)
        expect(json.data!.list[0]).toHaveProperty('title')
    })

    it('POST /user/login 登录成功并返回用户信息', async () => {
        const fixtures = await getTestFixtures()

        const { json } = await requestApp<{ user: string, userid: string, username: string }>(frontendApp, {
            method: 'POST',
            path: '/api/frontend/user/login',
            body: {
                username: fixtures.user.username,
                password: fixtures.user.password,
            },
        })

        expect(json.code).toBe(API_CODE.OK)
        expect(json.data?.username).toBe(encodeURI(fixtures.user.username))
        expect(typeof json.data?.user).toBe('string')
    })

    it('GET /user/logout 返回登出结果', async () => {
        const fixtures = await getTestFixtures()
        const userCookie = await loginUserViaApi(
            options => requestApp(frontendApp, options),
            fixtures,
        )

        const { json } = await requestApp<string>(frontendApp, {
            path: '/api/frontend/user/logout',
            cookie: userCookie,
        })

        expect(json.code).toBe(API_CODE.OK)
        expect(json.data).toBe('退出成功')
    })

    it('POST /comment/insert 登录后可提交评论', async () => {
        const fixtures = await getTestFixtures()
        const userCookie = await loginUserViaApi(
            options => requestApp(frontendApp, options),
            fixtures,
        )

        const { json } = await requestApp<{ content: string, article_id: string }>(frontendApp, {
            method: 'POST',
            path: '/api/frontend/comment/insert',
            cookie: userCookie,
            body: {
                id: fixtures.article.id,
                content: TEST_COMMENT_MARKER,
            },
        })

        expect(json.code).toBe(API_CODE.OK)
        expect(json.data?.content).toBe(TEST_COMMENT_MARKER)
        expect(json.data?.article_id).toBe(fixtures.article.id)
    })

    it('POST /user/login 缺少必填字段时返回校验错误', async () => {
        const { json } = await requestApp<null>(frontendApp, {
            method: 'POST',
            path: '/api/frontend/user/login',
            body: {
                username: '',
            },
        })

        expect(json.code).toBe(500)
        expect(json.message).toContain('password')
    })

    it('未知路由返回 404', async () => {
        const { json } = await requestApp<null>(frontendApp, {
            path: '/api/frontend/not-found',
        })

        expect(json.code).toBe(API_CODE.NOT_FOUND)
        expect(json.message).toBe('接口不存在')
    })
})
