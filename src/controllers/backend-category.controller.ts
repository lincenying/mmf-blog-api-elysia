import type { CategoryInsert, CategoryModify } from '~/schema/elysia-schema'
import mongoose from '~/db/mongoose'
import { ApiError } from '~/middleware/response-wrapper'
import { BackendArticleModel } from '~/models/backend-category.model'

export class BackendCategoryController {
    public static async getList() {
        return BackendArticleModel.getList()
    }

    public static async getItem(reqQuery: { id: string }) {
        const { id: _id } = reqQuery

        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            throw new ApiError(201, '参数错误')
        }

        return BackendArticleModel.getItem(reqQuery)
    }

    public static async insert(reqBody: CategoryInsert) {
        const { cate_name, cate_order } = reqBody

        if (!cate_name || !cate_order) {
            throw new ApiError(201, '请填写分类名称和排序')
        }

        return BackendArticleModel.insert(reqBody)
    }

    public static async deletes(reqQuery: { id: string }) {
        const { id: _id } = reqQuery

        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            throw new ApiError(201, '参数错误')
        }

        return BackendArticleModel.deletes(reqQuery)
    }

    public static async recover(reqQuery: { id: string }) {
        const { id: _id } = reqQuery

        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            throw new ApiError(201, '参数错误')
        }

        return BackendArticleModel.recover(reqQuery)
    }

    public static async modify(reqBody: CategoryModify) {
        return BackendArticleModel.modify(reqBody)
    }
}
