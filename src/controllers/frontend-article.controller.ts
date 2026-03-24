import type { ReqListQuery } from '~/types/global.types'
import { FrontendArticleModel } from '~/models/frontend-article.model'

export class FrontendArticleController {
    public static async getList(reqQuery: ReqListQuery, user_id?: string) {
        return FrontendArticleModel.getList(reqQuery, user_id)
    }

    public static async getItem(reqQuery: { id: string }, user_id: Nullable<string>) {
        return FrontendArticleModel.getItem(reqQuery, user_id)
    }

    public static async getTrending(reqQuery: { id: string }) {
        return FrontendArticleModel.getTrending(reqQuery)
    }
}
