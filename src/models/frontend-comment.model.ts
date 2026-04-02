import type { Comment } from '~/types/comment.types'
import type { ReqListQuery } from '~/types/global.types'

import mongoose from '~/db/mongoose'
import { ApiError } from '~/middleware/response-wrapper'
import ArticleM from '~/schema/mongoose-article'
import CommentM from '~/schema/mongoose-comment'
import { getErrorMessage, getNowTime } from '~/utils'

export class FrontendCommentModel {
    /**
     * 发布评论
     */
    public static async insert(reqBody: { id: string, content: string }, userid?: string) {
        const { id: _id, content } = reqBody

        const creat_date = getNowTime()
        const timestamp = getNowTime('X')
        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            throw new ApiError(201, '参数错误')
        }
        else if (!content) {
            throw new ApiError(201, '请输入评论内容')
        }
        else if (!userid) {
            throw new ApiError(201, '请先登录')
        }
        else {
            const data: Comment = {
                article_id: _id,
                userid,
                content,
                creat_date,
                is_delete: 0,
                timestamp,
            }
            try {
                const result = await CommentM.create(data).then(data => data.toObject())
                const filter = { _id }
                const body = {
                    $inc: {
                        comment_count: 1,
                    },
                }
                await ArticleM.updateOne(filter, body).exec()
                return result
            }
            catch (err: unknown) {
                throw new ApiError(-200, getErrorMessage(err))
            }
        }
    }

    /**
     * 前台浏览时, 读取评论列表
     */
    public static async getList(reqQuery: ReqListQuery) {
        const { all, id: article_id } = reqQuery

        let { limit, page } = reqQuery

        if (!article_id || !mongoose.Types.ObjectId.isValid(article_id)) {
            throw new ApiError(201, '参数错误')
        }
        else {
            page = Number(page) || 1
            limit = Number(limit) || 10

            const data: {
                article_id: string
                is_delete?: number
            } = {
                article_id,
            }
            const skip = (page - 1) * limit
            if (!all) {
                data.is_delete = 0
            }

            try {
                const [list, total] = await Promise.all([
                    CommentM.find(data).sort('-_id').skip(skip).limit(limit).lean(),
                    CommentM.countDocuments(data),
                ])
                const totalPage = Math.ceil(total / limit)
                return {
                    list,
                    total,
                    hasNext: totalPage > page ? 1 : 0,
                    hasPrev: page > 1 ? 1 : 0,
                }
            }
            catch (err: unknown) {
                throw new ApiError(-200, getErrorMessage(err))
            }
        }
    }

    /**
     * 评论删除
     */
    public static async deletes(reqQuery: { id: string }) {
        const { id: _id } = reqQuery

        try {
            const filter = { _id }
            const commentBody = { is_delete: 0 }
            const ArticleBody = { $inc: { comment_count: -1 } }
            await Promise.all([
                CommentM.updateOne(filter, commentBody).exec(),
                ArticleM.updateOne(filter, ArticleBody).exec(),
            ])
            return '删除成功'
        }
        catch (err: unknown) {
            throw new ApiError(-200, getErrorMessage(err))
        }
    }

    /**
     * 评论恢复
     */
    public static async recover(reqQuery: { id: string }) {
        const { id: _id } = reqQuery

        try {
            const filter = { _id }
            const commentBody = { is_delete: 0 }
            const ArticleBody = { $inc: { comment_count: 1 } }
            await Promise.all([
                CommentM.updateOne(filter, commentBody).exec(),
                ArticleM.updateOne(filter, ArticleBody).exec(),
            ])
            return '恢复成功'
        }
        catch (err: unknown) {
            throw new ApiError(-200, getErrorMessage(err))
        }
    }
}
