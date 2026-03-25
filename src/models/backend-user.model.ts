import type { UserModify } from '~/types/user'

import fs from 'node:fs'
import jwt from 'jsonwebtoken'
import md5 from 'md5'

import { config, secretServer as secret } from '~/config'
import mongoose from '~/db/mongoose'
import { ApiError } from '~/middleware/response-wrapper'
import AdminM from '~/schema/admin'
import { fsExistsSync, getErrorMessage, getNowTime } from '~/utils'

export class BackendUserModel {
/**
 * 获取管理员列表
 */
    public static async getList(reqQuery: { page?: number, limit?: number }) {
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
            throw new ApiError(-200, getErrorMessage(err))
        }
    }

    /**
     * 获取单个管理员
     */
    public static async getItem(reqQuery: { id: string }) {
        const { id: _id } = reqQuery

        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            throw new ApiError(201, '参数错误')
        }
        else {
            try {
                const filter = { _id }
                const result = await AdminM.findOne(filter).lean()
                return result
            }
            catch (err: unknown) {
                throw new ApiError(-200, getErrorMessage(err))
            }
        }
    }

    /**
     * 管理员登录
     */
    public static async login(reqBody: { password: string, username: string }) {
        const { password, username } = reqBody

        if (username === '' || password === '') {
            throw new ApiError(201, '请输入用户名和密码')
        }
        else {
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
                    const token = jwt.sign({ id, username: _username }, secret, { expiresIn: 60 * 60 * 24 * 30 })

                    return {
                        user: token,
                        username: _username,
                        userid: id,
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
    }

    /**
     * 管理员退出
     */
    public static logout() {
        return '退出成功'
    }

    /**
     * 初始化时添加管理员
     */
    public static async insert(email: string, password: string, username: string) {
        let message = ''

        if (!username || !password || !email) {
            message = '请将表单填写完整'
        }
        else if (fsExistsSync('./admin.lock')) {
            message = '请先把项目根目录的 admin.lock 文件删除'
        }
        else {
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
                    fs.writeFileSync('./admin.lock', username)
                    message = `添加用户成功: ${username}, 密码: ${password}`
                }
            }
            catch (err: unknown) {
                message = getErrorMessage(err)
            }
        }
        return message
    }

    /**
     * 管理员编辑
     */
    public static async modify(reqBody: { id: string, email: string, password: string, username: string }) {
        const { id: _id, email, password, username } = reqBody

        const body: UserModify = {
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
            throw new ApiError(-200, getErrorMessage(err))
        }
    }

    /**
     * 管理员删除
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
            throw new ApiError(-200, getErrorMessage(err))
        }
    }

    /**
     * 管理员恢复
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
            throw new ApiError(-200, getErrorMessage(err))
        }
    }
}
