import type { UserInsert, UserModify, UserModifyForm, UserPassword } from '~/schema/elysia-schema'

import { strLen } from '@lincy/utils'
import { and, count, desc, eq } from 'drizzle-orm'

import jwt from 'jsonwebtoken'
import md5 from 'md5'
import { config, secretClient as secret } from '~/config'
import { db } from '~/db/postgre-sql'
import { ApiError } from '~/middleware/response-wrapper'
import { users } from '~/schema/postgre-sql'
import { getErrorMessage, getNowTime } from '~/utils'

export class PostgreFrontendUserModel {
/**
 * 用户列表
 */
    public static async getList(query: { page?: number, limit?: number }) {
        try {
            const page = Math.max(1, query.page ?? 1)
            const limit = Math.min(100, Math.max(1, query.limit ?? 10))
            const offset = (page - 1) * limit
            const data = await db.select().from(users).orderBy(desc(users.creat_date)).limit(limit).offset(offset)

            const totalResult = await db.select({ value: count() }).from(users)
            const total = Number(totalResult[0]?.value) ?? 0
            const totalPages = Math.ceil(total / limit)

            return {
                list: data,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                },
            }
        }
        catch (err: unknown) {
            throw new ApiError(-200, getErrorMessage(err))
        }
    }

    /**
     * 用户登录
     */
    public static async login(reqBody: { username: string, password: string }) {
        let { username } = reqBody

        const { password } = reqBody

        if (username === '' || password === '') {
            throw new ApiError(201, '请输入用户名和密码')
        }

        try {
            const result = await db.query.users.findFirst({
                where: and(
                    eq(users.username, username),
                    eq(users.password, md5(config.md5_salt + password)),
                    eq(users.is_delete, 0),
                ),
            })

            if (result) {
                username = encodeURI(username)
                const { _id, email: useremail } = result

                const token = jwt.sign({ id: _id, username }, secret, { expiresIn: 60 * 60 * 24 * 30 })
                return {
                    user: token,
                    userid: _id,
                    username,
                    useremail,
                }
            }
            else {
                throw new ApiError(201, '用户名或者密码错误')
            }
        }
        catch (err: unknown) {
            throw new ApiError(-200, getErrorMessage(err))
        }
    }

    /**
     * 用户退出
     */
    public static logout() {
        return '退出成功'
    }

    /**
     * 用户注册
     */
    public static async insert(reqBody: UserInsert) {
        const { email, password, username } = reqBody

        if (!username || !password || !email) {
            throw new ApiError(201, '请将表单填写完整')
        }
        else if (strLen(username) < 4) {
            throw new ApiError(201, '用户长度至少 2 个中文或 4 个英文')
        }
        else if (strLen(password) < 8) {
            throw new ApiError(201, '密码长度至少 8 位')
        }
        else {
            try {
                const result = await db.query.users.findFirst({
                    where: eq(users.username, username),
                })
                if (result) {
                    throw new ApiError(201, '该用户名已经存在')
                }
                else {
                    await db.insert(users).values({
                        username,
                        password: md5(config.md5_salt + password),
                        email,
                        creat_date: getNowTime(),
                        update_date: getNowTime(),
                        is_delete: 0,
                        timestamp: Number(getNowTime('X')),
                    })
                    return '注册成功!'
                }
            }
            catch (err: unknown) {
                throw new ApiError(-200, getErrorMessage(err))
            }
        }
    }

    /**
     * 获取用户信息
     */
    public static async getItem(userid: string) {
        try {
            const result = await db.query.users.findFirst({
                where: and(
                    eq(users._id, userid),
                    eq(users.is_delete, 0),
                ),
            })
            if (result) {
                return result
            }
            return '请先登录, 或者数据错误'
        }
        catch (err: unknown) {
            throw new ApiError(-200, getErrorMessage(err))
        }
    }

    /**
     * 用户编辑
     */
    public static async modify(reqBody: UserModify) {
        const { id, email, password, username } = reqBody

        const body: UserModifyForm = {
            email,
            username,
            update_date: getNowTime(),
        }
        if (password) {
            body.password = md5(config.md5_salt + password)
        }

        try {
            const updated = await db.update(users).set(body).where(eq(users._id, id)).returning()
            if (!updated.length) {
                throw new ApiError(201, '用户未找到')
            }
            return updated[0]
        }
        catch (err: unknown) {
            throw new ApiError(-200, getErrorMessage(err))
        }
    }

    /**
     * 账号编辑
     */
    public static async account(reqBody: { email: string }, user_id?: string) {
        if (!user_id) {
            throw new ApiError(201, '请先登录')
        }

        const { email } = reqBody

        try {
            await db.update(users).set({ email }).where(eq(users._id, user_id)).returning()
            return { email }
        }
        catch (err: unknown) {
            throw new ApiError(-200, getErrorMessage(err))
        }
    }

    /**
     * 密码编辑
     */
    public static async password(reqBody: UserPassword, user_id?: string) {
        if (!user_id) {
            throw new ApiError(201, '请先登录')
        }

        const { old_password, password } = reqBody

        try {
            const updated = await db.update(users).set({ password: md5(config.md5_salt + password) }).where(
                and(
                    eq(users._id, user_id),
                    eq(users.is_delete, 0),
                    eq(users.password, md5(config.md5_salt + old_password)),
                ),
            ).returning()

            if (updated.length) {
                const body = {
                    password: md5(config.md5_salt + password),
                }
                await db.update(users).set(body).where(eq(users._id, user_id)).returning()
                return 'success'
            }
            else {
                throw new ApiError(201, '原始密码错误')
            }
        }
        catch (err: unknown) {
            throw new ApiError(-200, getErrorMessage(err))
        }
    }

    /**
     * 用户删除
     */
    public static async deletes(reqQuery: { id: string }) {
        const { id: _id } = reqQuery

        try {
            const body = {
                is_delete: 1,
            }
            await db.update(users).set(body).where(eq(users._id, _id)).returning()
            return '删除功能'
        }
        catch (err: unknown) {
            throw new ApiError(-200, getErrorMessage(err))
        }
    }

    /**
     * 用户恢复
     */
    public static async recover(reqQuery: { id: string }) {
        const { id: _id } = reqQuery

        try {
            const body = {
                is_delete: 0,
            }
            await db.update(users).set(body).where(eq(users._id, _id)).returning()
            return '恢复成功'
        }
        catch (err: unknown) {
            throw new ApiError(-200, getErrorMessage(err))
        }
    }
}
