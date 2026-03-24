import { Elysia, t } from 'elysia'
import { ArticleController } from '~/controllers/sqlite-article.controller'
import { responseWrapperMiddleware } from '~/middleware/response-wrapper'
import { createCorsConfig } from '~/plugins'

export const sqliteRouter = new Elysia({ prefix: '/api/sqlite' })
    .use(createCorsConfig())
    .use(responseWrapperMiddleware)
    .post(
        '/article/',
        ({ body }) => ArticleController.create(body),
        {
            body: t.Object({
                title: t.String(),
                content: t.String(),
                date: t.String(),
                author: t.String(),
                category: t.String(),
            }),
        },
    )
    .get(
        '/article/',
        ({ query }) => ArticleController.getAllArticles(query.page || 1, query.pageSize || 10), {
            query: t.Partial(
                t.Object({
                    page: t.Numeric(),
                    pageSize: t.Numeric(),
                }),
            ),
        })
    .delete(
        '/article/:id',
        ({ params: { id } }) => ArticleController.deleteArticleById(id),
        {
            params: t.Object({
                id: t.Numeric(),
            }),
        },
    )
    .get(
        '/article/:id',
        ({ params: { id } }) => ArticleController.getArticleById(id),
        {
            params: t.Object({
                id: t.Numeric(),
            }),
        },
    )
    .put(
        '/article/:id',
        ({ params: { id }, body }) => ArticleController.updateArticleById({ id, ...body }),
        {
            params: t.Object({
                id: t.Numeric(),
            }),
            body: t.Object({
                title: t.String(),
                content: t.String(),
                date: t.String(),
                author: t.String(),
                category: t.String(),
            }),
        },
    )
