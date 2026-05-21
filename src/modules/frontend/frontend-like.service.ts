import { FrontendLikeModel } from './frontend-like.model'

/**
 * 前台点赞业务（Mongoose）。
 */
export class FrontendLikeService {
    public static async like(reqQuery: { id: string }, user_id?: string) {
        return FrontendLikeModel.like(reqQuery, user_id)
    }

    public static async unlike(reqQuery: { id: string }, user_id?: string) {
        return FrontendLikeModel.unlike(reqQuery, user_id)
    }

    public static async resetLike() {
        return FrontendLikeModel.resetLike()
    }
}
