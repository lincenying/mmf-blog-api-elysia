import { FrontendLikeModel } from '~/models/frontend-like.model'

export class FrontendLikeController {
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
