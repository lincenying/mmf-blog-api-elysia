import { Elysia, t } from 'elysia'
import { ArticleController } from '~/controllers/sqlite-article.controller'
import { responseWrapperMiddleware } from '~/middleware/response-wrapper'
import { createCorsConfig } from '~/plugins'
import { tt } from '~/schema/validation-schema-error'

export const sqliteRouter = new Elysia({ prefix: '/api/sqlite' })
    .use(createCorsConfig())
    .use(responseWrapperMiddleware)
    .post(
        '/article/',
        ({ body }) => ArticleController.create(body),
        {
            body: t.Object({
                title: tt.String('标题'),
                content: tt.String('内容'),
                date: tt.String('日期'),
                author: tt.String('作者'),
                category: tt.String('分类'),
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
                id: tt.Numeric('文章ID'),
            }),
        },
    )
    .get(
        '/article/:id',
        ({ params: { id } }) => ArticleController.getArticleById(id),
        {
            params: t.Object({
                id: tt.Numeric('文章ID'),
            }),
        },
    )
    .put(
        '/article/:id',
        ({ params: { id }, body }) => ArticleController.updateArticleById({ id, ...body }),
        {
            params: t.Object({
                id: tt.Numeric('文章ID'),
            }),
            body: t.Object({
                title: tt.String('标题'),
                content: tt.String('内容'),
                date: tt.String('日期'),
                author: tt.String('作者'),
                category: tt.String('分类'),
            }),
        },
    )
