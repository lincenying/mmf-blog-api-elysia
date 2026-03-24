import type { CategoryInsert, CategoryModify } from '~/types/catagory.types'
import { BackendArticleModel } from '~/models/backend-category.model'

export class BackendCategoryController {
    public static async getList() {
        return BackendArticleModel.getList()
    }

    public static async getItem(reqQuery: { id: string }) {
        return BackendArticleModel.getItem(reqQuery)
    }

    public static async insert(reqBody: CategoryInsert) {
        return BackendArticleModel.insert(reqBody)
    }

    public static async deletes(reqQuery: { id: string }) {
        return BackendArticleModel.deletes(reqQuery)
    }

    public static async recover(reqQuery: { id: string }) {
        return BackendArticleModel.recover(reqQuery)
    }

    public static async modify(reqBody: CategoryModify) {
        return BackendArticleModel.modify(reqBody)
    }
}
