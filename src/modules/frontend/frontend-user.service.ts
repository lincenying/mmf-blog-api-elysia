import type { OtherPage, UserInsert, UserLogin, UserModify, UserModifyForm, UserPassword } from '~/schema/elysia-schema'

import { strLen } from '@lincy/utils'

import md5 from 'md5'
import { config } from '~/config'
import UserM from '~/db/schema/user.schema'
import { ApiError } from '~/plugins/response-wrapper'
import { API_CODE } from '~/types/api-code'
import { getErrorMessage, getNowTime } from '~/utils'
import { signSessionToken } from '~/utils/jwt-token'

/**
 * 前台用户业务（Mongoose）。
 */
export class FrontendUserService {
    /**
     * 用户列表。
     */
    public static async getList(reqQuery: OtherPage) {
        const sort = '-_id'
        const page = Number(reqQuery.page) || 1
        const limit = Number(reqQuery.limit) || 10
        const skip = (page - 1) * limit

        try {
            const [list, total] = await Promise.all([
                UserM.find()
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                UserM.countDocuments(),
            ])
            const totalPage = Math.ceil(total / limit)
            return {
                list,
                total,
                hasNext: totalPage > page ? 1 : 0,
                hasPrev: page > 1 ? 1 : 0,
            }
        }
        catch (err: unknown) {
            throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
        }
    }

    /**
     * 用户登录。
     */
    public static async login(reqBody: UserLogin) {
        let { username } = reqBody

        const { password } = reqBody

        if (username === '' || password === '') {
            throw new ApiError(API_CODE.VALIDATION, '请输入用户名和密码')
        }

        try {
            const filter = {
                username,
                password: md5(config.md5_salt + password),
                is_delete: 0,
            }
            const result = await UserM.findOne(filter).lean()

            if (result) {
                username = encodeURI(username)
                const { id = '', email: useremail } = result

                const token = signSessionToken({ id, username }, 'user')
                return {
                    user: token,
                    userid: id,
                    username,
                    useremail,
                }
            }
            else {
                throw new ApiError(API_CODE.VALIDATION, '用户名或者密码错误')
            }
        }
        catch (err: unknown) {
            throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
        }
    }

    /**
     * 用户退出。
     */
    public static logout() {
        return '退出成功'
    }

    /**
     * 用户注册。
     */
    public static async insert(reqBody: UserInsert) {
        const { email, password, username } = reqBody

        if (!username || !password || !email) {
            throw new ApiError(API_CODE.VALIDATION, '请将表单填写完整')
        }
        else if (strLen(username) < 4) {
            throw new ApiError(API_CODE.VALIDATION, '用户长度至少 2 个中文或 4 个英文')
        }
        else if (strLen(password) < 8) {
            throw new ApiError(API_CODE.VALIDATION, '密码长度至少 8 位')
        }
        else {
            try {
                const result = await UserM.findOne({ username }).lean()
                if (result) {
                    throw new ApiError(API_CODE.VALIDATION, '该用户名已经存在')
                }
                else {
                    const data = {
                        username,
                        password: md5(config.md5_salt + password),
                        email,
                        creat_date: getNowTime(),
                        update_date: getNowTime(),
                        is_delete: 0,
                        timestamp: getNowTime('X'),
                    }
                    await UserM.create(data)
                    return '注册成功!'
                }
            }
            catch (err: unknown) {
                throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
            }
        }
    }

    /**
     * 获取用户信息。
     */
    public static async getItem(userid: string) {
        try {
            const filter = { _id: userid, is_delete: 0 }
            const result = await UserM.findOne(filter).lean()
            if (result) {
                return result
            }
            return '请先登录, 或者数据错误'
        }
        catch (err: unknown) {
            throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
        }
    }

    /**
     * 用户编辑。
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
            const filter = { _id: id }
            const result = await UserM.findOneAndUpdate(filter, body, { new: true }).lean()
            return result
        }
        catch (err: unknown) {
            throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
        }
    }

    /**
     * 账号编辑。
     */
    public static async account(reqBody: { email: string }, user_id?: string) {
        if (!user_id) {
            throw new ApiError(API_CODE.VALIDATION, '请先登录')
        }

        const { email } = reqBody

        try {
            await UserM.updateOne({ _id: user_id }, { $set: { email } }).exec()
            return { email }
        }
        catch (err: unknown) {
            throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
        }
    }

    /**
     * 密码编辑。
     */
    public static async password(reqBody: UserPassword, user_id?: string) {
        if (!user_id) {
            throw new ApiError(API_CODE.VALIDATION, '请先登录')
        }

        const { old_password, password } = reqBody

        try {
            const filter = {
                _id: user_id,
                password: md5(config.md5_salt + old_password),
                is_delete: 0,
            }

            const result = await UserM.findOne(filter).lean()
            if (result) {
                const filter = {
                    _id: user_id,
                }
                const body = {
                    $set: {
                        password: md5(config.md5_salt + password),
                    },
                }
                await UserM.updateOne(filter, body)
                return 'success'
            }
            else {
                throw new ApiError(API_CODE.VALIDATION, '原始密码错误')
            }
        }
        catch (err: unknown) {
            throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
        }
    }

    /**
     * 用户删除。
     */
    public static async deletes(reqQuery: { id: string }) {
        const { id: _id } = reqQuery

        try {
            const filter = { _id }
            const body = {
                is_delete: 1,
            }
            await UserM.updateOne(filter, body).exec()
            return '删除功能'
        }
        catch (err: unknown) {
            throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
        }
    }

    /**
     * 用户恢复。
     */
    public static async recover(reqQuery: { id: string }) {
        const { id: _id } = reqQuery

        try {
            const filter = { _id }
            const body = {
                is_delete: 0,
            }
            await UserM.updateOne(filter, body).exec()
            return '恢复成功'
        }
        catch (err: unknown) {
            throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
        }
    }
}
