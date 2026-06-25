import type { OtherPage, UserInsert, UserLogin, UserModify, UserModifyForm } from '~/schema/elysia-schema'

import { writeFileSync } from 'fs'

import md5 from 'md5'
import { config } from '~/config'
import mongoose from '~/db/mongoose'
import AdminM from '~/db/schema/admin.schema'
import { ApiError } from '~/plugins/response-wrapper'
import { API_CODE } from '~/types/api-code'
import { fsExistsSync, getErrorMessage, getNowTime } from '~/utils'
import { signSessionToken } from '~/utils/jwt-token'

/**
 * 后台管理员账号业务（Mongoose）。
 */
export class BackendUserService {
    /**
     * 获取管理员列表。
     */
    public static async getList(reqQuery: OtherPage) {
        const sort = '-_id'
        const page = Number(reqQuery.page) || 1
        const limit = Number(reqQuery.limit) || 10
        const skip = (page - 1) * limit
        try {
            const [list, total] = await Promise.all([
                AdminM.find()
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                AdminM.countDocuments(),
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
     * 获取单个管理员。
     */
    public static async getItem(reqQuery: { id: string }) {
        const { id: _id } = reqQuery

        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            throw new ApiError(API_CODE.VALIDATION, '参数错误')
        }

        try {
            const filter = { _id }
            const result = await AdminM.findOne(filter).lean()
            return result
        }
        catch (err: unknown) {
            throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
        }
    }

    /**
     * 管理员登录。
     */
    public static async login(reqBody: UserLogin) {
        const { password, username } = reqBody

        if (username === '' || password === '') {
            throw new ApiError(API_CODE.VALIDATION, '请输入用户名和密码')
        }

        try {
            const filter = {
                username,
                password: md5(config.md5_salt + password),
                is_delete: 0,
            }
            const result = await AdminM.findOne(filter).lean()
            if (result) {
                const _username = encodeURI(username)
                const id = result.id || ''
                const token = signSessionToken({ id, username: _username }, 'admin')

                return {
                    user: token,
                    username: _username,
                    userid: id,
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
     * 管理员退出。
     */
    public static logout() {
        return '退出成功'
    }

    /**
     * 初始化时添加管理员。
     */
    public static async insert(reqBody: UserInsert) {
        if (!reqBody.username || !reqBody.password || !reqBody.email) {
            return '请将表单填写完整'
        }
        if (fsExistsSync('./admin.lock')) {
            return '请先把项目根目录的 admin.lock 文件删除'
        }

        const { username, password, email } = reqBody
        let message = ''
        try {
            const filter = { username }
            const result = await AdminM.findOne(filter).lean()
            if (result) {
                message = `${username}: 已经存在`
            }
            else {
                const body = {
                    username,
                    password: md5(config.md5_salt + password),
                    email,
                    creat_date: getNowTime(),
                    update_date: getNowTime(),
                    is_delete: 0,
                    timestamp: getNowTime('X'),
                }
                await AdminM.create(body)
                writeFileSync('./admin.lock', username)
                message = `添加用户成功: ${username}, 密码: ${password}`
            }
        }
        catch (err: unknown) {
            message = getErrorMessage(err)
        }
        return message
    }

    /**
     * 管理员编辑。
     */
    public static async modify(reqBody: UserModify) {
        const { id: _id, email, password, username } = reqBody

        const body: UserModifyForm = {
            email,
            username,
            update_date: getNowTime(),
        }
        if (password) {
            body.password = md5(config.md5_salt + password)
        }

        try {
            const filter = { _id }
            const result = await AdminM.findOneAndUpdate(filter, body, { new: true }).lean()
            return result
        }
        catch (err: unknown) {
            throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
        }
    }

    /**
     * 管理员删除。
     */
    public static async deletes(reqQuery: { id: string }) {
        const { id: _id } = reqQuery

        try {
            const filter = { _id }
            const body = { is_delete: 1 }
            await AdminM.updateOne(filter, body).exec()
            return '删除成功'
        }
        catch (err: unknown) {
            throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
        }
    }

    /**
     * 管理员恢复。
     */
    public static async recover(reqQuery: { id: string }) {
        const { id: _id } = reqQuery

        try {
            const filter = { _id }
            const body = { is_delete: 0 }
            await AdminM.updateOne(filter, body).exec()
            return '恢复成功'
        }
        catch (err: unknown) {
            throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
        }
    }
}
