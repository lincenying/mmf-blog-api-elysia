import type { ArticleInsert, ArticleModify } from '~/types/article.types'

import mongoose from '~/db/mongoose'
import { ApiError } from '~/middleware/response-wrapper'
import { BackendArticleModel } from '~/models/backend-article.model'

export class BackendArticleController {
    public static getList(reqQuery: { page?: string, limit?: string, sort?: string, key?: string }) {
        return BackendArticleModel.getList(reqQuery)
    }

    public static async getItem(reqQuery: { id: string }) {
        const { id: _id } = reqQuery

        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            throw new ApiError(201, '参数错误')
        }

        return BackendArticleModel.getItem(reqQuery)
    }

    public static async insert(reqBody: ArticleInsert) {
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

    public static async modify(reqBody: ArticleModify) {
        return BackendArticleModel.modify(reqBody)
    }
}
