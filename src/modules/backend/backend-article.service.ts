import type { ArticleInsert, ArticleModify, ArticlePage } from '~/schema/elysia-schema'
import type { Article } from '~/types/article.types'

import hljs from 'highlight.js'
import markdownIt from 'markdown-it'

import mongoose from '~/db/mongoose'
import ArticleM from '~/db/schema/mongoose/article.schema'
import CategoryM from '~/db/schema/mongoose/category.schema'
import { ApiError } from '~/plugins/response-wrapper'
import { API_CODE } from '~/types/api-code'
import { getErrorMessage, getNowTime } from '~/utils'

interface ArticleSearchPayload {
    title?: {
        $regex: RegExp
    }
}

/**
 * 后台文章业务（Mongoose）。
 */
export class BackendArticleService {
    /**
     * 将 Markdown 格式的内容转换成 HTML 格式，并生成目录（TOC）。
     */
    public static marked(content: string) {
        const $return = {
            html: '',
            toc: '',
        }

        const html = markdownIt({
            breaks: true,
            html: true,
            linkify: true,
            typographer: true,
            highlight(str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(str, { language: lang }).value
                    }
                    catch (_error) {}
                }
                return ''
            },
        }).render(content)

        $return.html = html

        return $return
    }

    /**
     * 获取文章列表。
     */
    public static async getList(reqQuery: ArticlePage) {
        const sort = reqQuery.sort || '-update_date'
        const page = Number(reqQuery.page) || 1
        const limit = Number(reqQuery.limit) || 15
        const skip = (page - 1) * limit
        const key = reqQuery.key || ''

        const payload: ArticleSearchPayload = {}

        if (key) {
            const reg = new RegExp(key, 'i')
            payload.title = { $regex: reg }
        }

        try {
            const [list, total] = await Promise.all([
                ArticleM.find(payload)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                ArticleM.countDocuments(payload),
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
            throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
        }
    }

    /**
     * 获取指定 ID 的文章。
     */
    public static async getItem(reqQuery: { id: string }) {
        const { id: _id } = reqQuery

        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            throw new ApiError(API_CODE.VALIDATION, '参数错误')
        }

        try {
            const filter = { _id }
            const result = await ArticleM.findOne(filter).lean()
            return result
        }
        catch (err: unknown) {
            throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
        }
    }

    /**
     * 新增文章。
     */
    public static async insert(reqBody: ArticleInsert) {
        const { category, content, title, html } = reqBody

        let mdHtml: string, mdToc: string
        if (html) {
            mdHtml = html
            mdToc = ''
        }
        else {
            const md = this.marked(content)
            mdToc = md.toc
            mdHtml = md.html
        }

        const arr_category = category.split('|')
        const data: Article = {
            title,
            category: arr_category[0],
            category_name: arr_category[1],
            content,
            html: mdHtml,
            toc: mdToc,
            visit: 0,
            like: 0,
            comment_count: 0,
            creat_date: getNowTime(),
            update_date: getNowTime(),
            is_delete: 0,
            timestamp: getNowTime('X'),
        }
        try {
            const result = await ArticleM.create(data).then(data => data.toObject())

            const filter = { _id: arr_category[0] }
            const body = {
                $inc: {
                    cate_num: 1,
                },
            }
            await CategoryM.updateOne(filter, body).exec()
            return result
        }
        catch (err: unknown) {
            throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
        }
    }

    /**
     * 删除文章并更新分类计数。
     */
    public static async deletes(reqQuery: { id: string }) {
        const { id: _id } = reqQuery

        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            throw new ApiError(API_CODE.VALIDATION, '参数错误')
        }

        try {
            const filter = { _id }
            const body = { is_delete: 1 }
            const result = await ArticleM.findOneAndUpdate(filter, body, { new: true }).exec()

            if (!result) {
                throw new ApiError(API_CODE.VALIDATION, '文章不存在')
            }

            const categoryFilter = { _id: result.category }
            const categoryBody = { $inc: { cate_num: -1 } }
            await CategoryM.updateOne(categoryFilter, categoryBody).exec()
            return result
        }
        catch (err: unknown) {
            throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
        }
    }

    /**
     * 恢复已删除文章。
     */
    public static async recover(reqQuery: { id: string }) {
        const { id: _id } = reqQuery

        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            throw new ApiError(API_CODE.VALIDATION, '参数错误')
        }

        try {
            const filter = { _id }
            const body = { is_delete: 0 }

            const result = await ArticleM.findOneAndUpdate(filter, body, { new: true }).exec()

            if (!result) {
                throw new ApiError(API_CODE.VALIDATION, '文章不存在')
            }

            const categoryFilter = { _id: result.category }
            const categoryBody = { $inc: { cate_num: 1 } }
            await CategoryM.updateOne(categoryFilter, categoryBody).exec()

            return result
        }
        catch (err: unknown) {
            throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
        }
    }

    /**
     * 修改文章信息。
     */
    public static async modify(reqBody: ArticleModify) {
        const { id: _id, category, category_old, content, title, html, category_name } = reqBody

        let mdHtml: string, mdToc: string
        if (html) {
            mdHtml = html
            mdToc = ''
        }
        else {
            const md = this.marked(content)
            mdHtml = md.html
            mdToc = md.toc
        }

        try {
            const filter = { _id }
            const body = {
                title,
                category,
                category_name,
                content,
                html: mdHtml,
                toc: mdToc,
                update_date: getNowTime(),
            }
            const result = await ArticleM.findOneAndUpdate(filter, body, { new: true }).exec().then(data => data?.toObject())

            if (!result) {
                throw new ApiError(API_CODE.VALIDATION, '文章不存在')
            }

            if (category !== category_old) {
                const newCategofyFilter = { _id: category }
                const oldCategoryFilter = { _id: category_old }
                const newCategoryBody = { $inc: { cate_num: 1 } }
                const oldCategoryBody = { $inc: { cate_num: -1 } }
                await Promise.all([
                    CategoryM.updateOne(newCategofyFilter, newCategoryBody).exec(),
                    CategoryM.updateOne(oldCategoryFilter, oldCategoryBody).exec(),
                ])
            }
            return result
        }
        catch (err: unknown) {
            throw new ApiError(API_CODE.SERVER_ERROR, getErrorMessage(err))
        }
    }
}
