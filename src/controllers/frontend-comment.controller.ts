import type { ReqListQuery } from '~/types/global.types'

import { FrontendCommentModel } from '~/models/frontend-comment.model'

export class FrontendCommentController {
    public static async insert(reqBody: { id: string, content: string }, userid?: string) {
        return FrontendCommentModel.insert(reqBody, userid)
    }

    public static async getList(reqQuery: ReqListQuery) {
        return FrontendCommentModel.getList(reqQuery)
    }

    public static async deletes(reqQuery: { id: string }) {
        return FrontendCommentModel.deletes(reqQuery)
    }

    public static async recover(reqQuery: { id: string }) {
        return FrontendCommentModel.recover(reqQuery)
    }
}
