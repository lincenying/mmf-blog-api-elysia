import type { ModifiedArticles, NewArticles } from '~/schema/bun-sqlite'

import { count, desc, eq } from 'drizzle-orm'
import { db } from '~/db/bun-sqlite'
import { ApiError } from '~/middleware/response-wrapper'
import { articles } from '~/schema/bun-sqlite'
import { getErrorMessage, getNowTime } from '~/utils'

export class SqliteFrontendArticleModel {
/**
 * 用户列表
 */
    public static async getList(query: { page?: number, limit?: number }) {
        try {
            const page = Math.max(1, query.page ?? 1)
            const limit = Math.min(100, Math.max(1, query.limit ?? 10))
            const offset = (page - 1) * limit
            const data = await db.select().from(articles).orderBy(desc(articles.id)).limit(limit).offset(offset)

            const totalResult = await db.select({ value: count() }).from(articles)
            const total = Number(totalResult[0]?.value) ?? 0
            const totalPages = Math.ceil(total / limit)

            return {
                list: data,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                },
            }
        }
        catch (err: unknown) {
            throw new ApiError(-200, getErrorMessage(err))
        }
    }

    /**
     * 文章发布
     */
    public static async insert(reqBody: NewArticles) {
        const { title, content, author, category } = reqBody

        if (!title || !content || !author || !category) {
            throw new ApiError(201, '请将表单填写完整')
        }
        else {
            try {
                const result = await db.insert(articles).values({
                    title,
                    content,
                    date: getNowTime(),
                    author,
                    category,
                    views: 0,
                }).returning()
                return result
            }
            catch (err: unknown) {
                throw new ApiError(-200, getErrorMessage(err))
            }
        }
    }

    /**
     * 获取文章
     */
    public static async getItem(id: number) {
        try {
            const result = await db.query.articles.findFirst({
                where: eq(articles.id, id),
            })
            if (result) {
                return result
            }
            return '数据错误'
        }
        catch (err: unknown) {
            throw new ApiError(-200, getErrorMessage(err))
        }
    }

    /**
     * 文章编辑
     */
    public static async modify(reqBody: ModifiedArticles) {
        const { id, title, content, author, category } = reqBody

        const body: ModifiedArticles = {
            title,
            content,
            author,
            category,
        }

        try {
            const updated = await db.update(articles).set(body).where(eq(articles.id, id!)).returning()
            if (!updated.length) {
                throw new ApiError(201, '文章未找到')
            }
            return updated[0]
        }
        catch (err: unknown) {
            throw new ApiError(-200, getErrorMessage(err))
        }
    }

    /**
     * 文章删除
     */
    public static async deletes(reqQuery: { id: number }) {
        const { id } = reqQuery

        try {
            await db.delete(articles).where(eq(articles.id, id!)).returning()
            return '删除功能'
        }
        catch (err: unknown) {
            throw new ApiError(-200, getErrorMessage(err))
        }
    }
}
