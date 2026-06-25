import type { CategoryInsert, CategoryModify } from '~/schema/elysia-schema'

import mongoose from '~/db/mongoose'
import CategoryM from '~/db/schema/category.schema'
import { ApiError } from '~/plugins/response-wrapper'
import { API_CODE } from '~/types/api-code'
import { getErrorMessage, getNowTime } from '~/utils'

/**
 * 后台分类业务（Mongoose）。
 */
export class BackendCategoryService {
    /**
     * 管理时，获取分类列表。
     */
    public static async getList() {
        try {
            const result = await CategoryM.find().sort('-cate_order').lean()
            return {
                list: result,
            }
        }
        catch (err: unknown) {
            throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
        }
    }

    /**
     * 管理时，获取分类详情。
     */
    public static async getItem(reqQuery: { id: string }) {
        const { id: _id } = reqQuery

        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            throw new ApiError(API_CODE.VALIDATION, '参数错误')
        }

        try {
            const filter = { _id }
            const result = await CategoryM.findOne(filter).lean()
            return result
        }
        catch (err: unknown) {
            throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
        }
    }

    /**
     * 管理时，新增分类。
     */
    public static async insert(reqBody: CategoryInsert) {
        const { cate_name, cate_order } = reqBody

        if (!cate_name || !cate_order) {
            throw new ApiError(API_CODE.VALIDATION, '请填写分类名称和排序')
        }

        try {
            const data = {
                cate_name,
                cate_order,
                cate_num: 0,
                creat_date: getNowTime(),
                update_date: getNowTime(),
                is_delete: 0,
                timestamp: Number(getNowTime('X')),
            }
            const result = await CategoryM.create(data).then(data => data.toObject())
            return result
        }
        catch (err: unknown) {
            throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
        }
    }

    /**
     * 管理时，删除分类。
     */
    public static async deletes(reqQuery: { id: string }) {
        const { id: _id } = reqQuery

        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            throw new ApiError(API_CODE.VALIDATION, '参数错误')
        }

        try {
            const filter = { _id }
            const body = { is_delete: 1 }
            await CategoryM.updateOne(filter, body).exec()
            return '删除成功'
        }
        catch (err: unknown) {
            throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
        }
    }

    /**
     * 管理时，恢复分类。
     */
    public static async recover(reqQuery: { id: string }) {
        const { id: _id } = reqQuery

        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            throw new ApiError(API_CODE.VALIDATION, '参数错误')
        }

        try {
            const filter = { _id }
            const body = { is_delete: 0 }
            await CategoryM.updateOne(filter, body).exec()
            return '恢复成功'
        }
        catch (err: unknown) {
            throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
        }
    }

    /**
     * 管理时，编辑分类。
     */
    public static async modify(reqBody: CategoryModify) {
        const { id: _id, cate_name, cate_order } = reqBody

        try {
            const filter = { _id }
            const body = {
                cate_name,
                cate_order,
                update_date: getNowTime(),
            }
            const result = await CategoryM.findOneAndUpdate(filter, body, { new: true }).lean()
            return result
        }
        catch (err: unknown) {
            throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
        }
    }
}
