import type { Elysia } from 'elysia'
import type { IApiResponse } from '~/types/global.types'

export interface IRequestOptions {
    method?: string
    path: string
    query?: Record<string, string>
    body?: unknown
    headers?: Record<string, string>
    cookie?: Record<string, string>
}

export interface IAppResponse<T> {
    status: number
    json: IApiResponse<T>
    setCookie: string | null
}

/**
 * 通过 Elysia.handle 发起 HTTP 请求并解析统一响应结构。
 */
export async function requestApp<T = unknown>(
    app: Elysia,
    options: IRequestOptions,
): Promise<IAppResponse<T>> {
    const url = new URL(options.path, 'http://localhost')

    if (options.query) {
        for (const [key, value] of Object.entries(options.query)) {
            url.searchParams.set(key, value)
        }
    }

    const headers = new Headers(options.headers ?? {})

    if (options.body !== undefined) {
        headers.set('Content-Type', 'application/json')
    }

    if (options.cookie) {
        const cookieHeader = Object.entries(options.cookie)
            .map(([key, value]) => `${key}=${value}`)
            .join('; ')
        headers.set('Cookie', cookieHeader)
    }

    const response = await app.handle(new Request(url.toString(), {
        method: options.method ?? 'GET',
        headers,
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    }))

    const json = await response.json() as IApiResponse<T>

    return {
        status: response.status,
        json,
        setCookie: response.headers.get('set-cookie'),
    }
}
