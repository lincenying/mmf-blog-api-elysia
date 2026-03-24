import type { ArticleInsert, ArticleModify } from '~/types/article.types'
import { BackendArticleModel } from '~/models/backend-article.model'

export class BackendArticleController {
    public static getList(reqQuery: { page?: string, limit?: string, sort?: string, key?: string }) {
        return BackendArticleModel.getList(reqQuery)
    }

    public static async getItem(reqQuery: { id: string }) {
        return BackendArticleModel.getItem(reqQuery)
    }

    public static async insert(reqBody: ArticleInsert) {
        return BackendArticleModel.insert(reqBody)
    }

    public static async deletes(reqQuery: { id: string }) {
        return BackendArticleModel.deletes(reqQuery)
    }

    public static async recover(reqQuery: { id: string }) {
        return BackendArticleModel.recover(reqQuery)
    }

    public static async modify(reqBody: ArticleModify) {
        return BackendArticleModel.modify(reqBody)
    }
}
