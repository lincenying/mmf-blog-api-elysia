import { ApiError } from '~/types'

import ArticleM from '../models/article'
import { getErrorMessage } from '../utils'

/**
 * 文章点赞
 */
export async function like(reqQuery: { id: string }, user_id?: string) {
    if (!user_id) {
        throw new ApiError(201, '请先登录')
    }

    const { id: article_id } = reqQuery

    try {
        const filter = {
            _id: article_id,
            is_delete: 0,
        }
        const result = await ArticleM.findOne(filter).lean()
        if (result && (!result.likes || result.likes.findIndex(item => item === user_id) === -1)) {
            const search = {
                _id: article_id,
            }
            const body = {
                $inc: {
                    like: 1,
                },
                $push: {
                    likes: user_id,
                },
            }
            await ArticleM.updateOne(search, body).exec()
        }
        return '操作成功'
    }
    catch (err: unknown) {
        throw new ApiError(-200, getErrorMessage(err))
    }
}

/**
 * 取消文章点赞
 */
export async function unlike(reqQuery: { id: string }, user_id?: string) {
    if (!user_id) {
        throw new ApiError(201, '请先登录')
    }

    const { id: article_id } = reqQuery

    try {
        const filter = {
            _id: article_id,
        }
        const body = {
            $inc: {
                like: -1,
            },
            $pullAll: {
                likes: [user_id],
            },
        }
        await ArticleM.updateOne(filter, body).exec()
        return '操作成功'
    }
    catch (err: unknown) {
        throw new ApiError(-200, getErrorMessage(err))
    }
}

/**
 * 重置文章点赞数量
 */
export async function resetLike() {
    try {
        const result = await ArticleM.find().exec()
        const length = result.length
        for (let i = 0; i < length; i++) {
            const item = result[i]
            const filter = { _id: item._id }
            const body = { like: item.likes?.length }
            await ArticleM.findOneAndUpdate(filter, body, { new: true }).exec()
        }
        return '操作成功'
    }
    catch (err: unknown) {
        throw new ApiError(-200, getErrorMessage(err))
    }
}
