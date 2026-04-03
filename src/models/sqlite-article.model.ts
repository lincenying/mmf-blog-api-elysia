import type { Article, ArticleUpdate } from '~/types/sqlite.types'

import db from '~/db/sqlite'
import { ApiError } from '~/middleware/response-wrapper'
import { getNowTime } from '~/utils'

export class ArticleModel {
    public static getAll(page: number = 1, pageSize: number = 10) {
        const offset = (page - 1) * pageSize
        const data = db.query<Article, null>(`SELECT * FROM articles order by id desc LIMIT ${pageSize} OFFSET ${offset}`).all(null)
        const total = db.prepare(`SELECT COUNT(*) as total FROM articles`).get() as { total: number }

        const hasNext = total.total > offset + pageSize ? 1 : 0
        const hasprev = page > 1 ? 1 : 0
        const totalPage = Math.ceil(total.total / pageSize)

        return {
            list: data,
            total: total.total,
            currPage: page,
            pageSize,
            hasNext,
            hasprev,
            totalPage,
        }
    }

    public static getById(id: number): Article | never {
        const result: Article | null = db.query<Article, number>(
            'SELECT * FROM articles WHERE id = ?',
        ).get(id)
        if (!result) {
            throw new ApiError(201, '文章不存在')
        }

        return result
    }

    public static deleteById(id: number): void | never {
        const result: Article | null = db.query<Article, number>('DELETE FROM articles WHERE id = ? RETURNING *').get(id)

        if (!result) {
            throw new ApiError(201, '文章删除失败')
        }
    }

    public static updateById(updateData: Required<ArticleUpdate>): Article | null {
        const result = db.prepare<Article, (string | number)[]>(
            'UPDATE article SET title = ?, content = ?, category = ?, date = ? where id = ? RETURNING *',
        ).get(
            updateData.title,
            updateData.content,
            updateData.category,
            updateData.date,
            updateData.id,
        )

        if (!result) {
            throw new ApiError(201, '文章编辑失败')
        }

        return result
    }

    public static create(createData: ArticleUpdate): Article | null {
        const result: Article | null = db.prepare<ArticleUpdate, Array<string | number>>(
            `INSERT INTO article (title, content, date, author, category, views) VALUES (?, ?, ?, ?, ?, ?) RETURNING *`,
        ).get(
            createData.title,
            createData.content,
            getNowTime(),
            createData.author,
            createData.category,
            0,
        )

        if (!result) {
            throw new ApiError(201, '文章创建失败')
        }

        return result
    }
}
