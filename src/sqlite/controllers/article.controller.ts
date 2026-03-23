import type { Article, ArticleUpdate } from '../types/article.types'
import { ArticleModel } from '../models/article.model'

export class ArticleController {
    public static getAllArticles(page: number, pageSize: number) {
        return ArticleModel.getAll(page, pageSize)
    }

    public static deleteArticleById(id: number): void {
        return ArticleModel.deleteById(id)
    }

    public static getArticleById(id: number): Article | null | never {
        return ArticleModel.getById(id)
    }

    public static updateArticleById(body: Required<ArticleUpdate>): Article | null {
        return ArticleModel.updateById(body)
    }

    public static create(body: ArticleUpdate): Article | null {
        return ArticleModel.create(body)
    }
}
