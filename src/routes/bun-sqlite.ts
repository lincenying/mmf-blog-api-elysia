import { Elysia, t } from 'elysia'

import { responseWrapperMiddleware } from '~/middleware/response-wrapper'
import { SqliteFrontendArticleModel } from '~/models/sqlite/article.model'
import { createCorsConfig } from '~/plugins'
import { validationSchema } from '~/schema/elysia-schema'
import { tt } from '~/schema/elysia-schema-error'

export const bunSqliteRouter = new Elysia({ prefix: '/api/bun-sqlite' })
    .use(createCorsConfig())
    .use(validationSchema)
    .use(responseWrapperMiddleware)
    .post(
        '/article/',
        ({ body }) => SqliteFrontendArticleModel.insert(body),
        {
            body: t.Object({
                title: tt.String('标题'),
                content: tt.String('内容'),
                author: tt.String('作者'),
                category: tt.String('分类'),
            }),
        },
    )
    .get(
        '/article/',
        ({ query }) => SqliteFrontendArticleModel.getList({ page: query.page || 1, limit: query.limit || 10 }), {
            query: 'other.page',
        })
    .delete(
        '/article/:id',
        ({ params: { id } }) => SqliteFrontendArticleModel.deletes({ id }),
        {
            params: t.Object({
                id: tt.Numeric('文章ID'),
            }),
        },
    )
    .get(
        '/article/:id',
        ({ params: { id } }) => SqliteFrontendArticleModel.getItem(id),
        {
            params: t.Object({
                id: tt.Numeric('文章ID'),
            }),
        },
    )
    .put(
        '/article/:id',
        ({ params: { id }, body }) => SqliteFrontendArticleModel.modify({ id, ...body }),
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
