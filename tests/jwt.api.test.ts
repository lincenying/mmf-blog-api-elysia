import { describe, expect, it } from 'vitest'

import { jwtRouter } from '~/modules/jwt/jwt.controller'
import { API_CODE } from '~/types/api-code'

import { requestApp } from './helpers/api-client'
import { createTestApp } from './helpers/test-app'

const jwtApp = createTestApp(jwtRouter)

describe('jWT 接口 /api/jwt', () => {
    it('get /sign/:name 签发 Cookie 并返回欢迎语', async () => {
        const { status, json, setCookie } = await requestApp<string>(jwtApp, {
            path: '/api/jwt/sign/alice',
        })

        expect(status).toBe(200)
        expect(json.code).toBe(API_CODE.OK)
        expect(json.data).toBe('Sign in as alice')
        expect(setCookie).toContain('auth=')
        expect(setCookie).toContain('HttpOnly')
    })

    it('get /profile 未携带 Cookie 时返回 401', async () => {
        const { status, json } = await requestApp<null>(jwtApp, {
            path: '/api/jwt/profile',
        })

        expect(status).toBe(200)
        expect(json.code).toBe(API_CODE.UNAUTHORIZED)
        expect(json.message).toBe('Unauthorized')
        expect(json.data).toBeNull()
    })

    it('get /profile 携带有效 Cookie 时返回用户信息', async () => {
        const signRes = await requestApp<string>(jwtApp, {
            path: '/api/jwt/sign/bob',
        })

        const authCookie = signRes.setCookie?.match(/auth=([^;]+)/)?.[1]
        expect(authCookie).toBeTruthy()

        const { status, json } = await requestApp<string>(jwtApp, {
            path: '/api/jwt/profile',
            cookie: { auth: authCookie! },
        })

        expect(status).toBe(200)
        expect(json.code).toBe(API_CODE.OK)
        expect(json.data).toBe('Hello bob')
    })

    it('未知路由返回 404', async () => {
        const { json } = await requestApp<null>(jwtApp, {
            path: '/api/jwt/not-found',
        })

        expect(json.code).toBe(API_CODE.NOT_FOUND)
        expect(json.message).toBe('接口不存在')
    })
})
