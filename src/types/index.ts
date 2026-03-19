export type ApiResponse<T = unknown>
    = | { code: number, success: true, data: T, message?: string }
        | { code: number, success: false, message: string }

/**
 * API 错误类
 *
 * 继承自Error，包含错误码信息
 * 中间件会自动检测此类型的错误并根据错误码设置相应的HTTP状态码
 */
export class ApiError extends Error {
    public readonly code: number

    constructor(code: number, message: string) {
        super(message)
        this.code = code
        this.name = 'ApiError'
    }
}

export interface ReqListQuery {
    all?: number
    by?: string
    from?: string
    id?: string
    limit?: number
    page?: number
    path?: string
    key?: string
    /* 列表中不显示的字段 */
    filter?: string
}

/**
 * 返回列表结构
 */
export interface ResData<T> {
    code: number
    data: T
    ok?: string | number
    from?: string
    message?: string
    msg?: string
    url?: string
}

export interface Lists<T> {
    hasNext?: number | boolean
    hasPrev?: number | boolean
    total: number
    list: T
}

/**
 * 返回列表结构
 */
export interface ResList<T> {
    code: number
    data: {
        list: T
    }
    message?: string
}

/**
 * 返回分页列表结构
 */
export interface ResLists<T> {
    code: number
    data: Lists<T>
    message?: string
}
