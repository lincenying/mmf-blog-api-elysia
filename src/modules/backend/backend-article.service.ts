import type { ArticleInsert, ArticleModify, ArticlePage } from '~/schema/elysia-schema'

import mongoose from '~/db/mongoose'
import { ApiError } from '~/plugins/response-wrapper'
import { BackendArticleModel } from './backend-article.model'

/**
 * 后台文章业务（Mongoose）。
 */
export class BackendArticleService {
    public static getList(reqQuery: ArticlePage) {
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
