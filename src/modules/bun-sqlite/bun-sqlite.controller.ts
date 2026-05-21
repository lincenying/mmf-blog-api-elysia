import { Elysia, t } from 'elysia'

import { createPublicApiLayer } from '~/plugins'
import { ApiError } from '~/plugins/response-wrapper'
import { tt } from '~/schema/elysia-schema-error'
import { API_CODE } from '~/types/api-code'

import { SqliteArticleService } from './bun-sqlite.service'

/** BunSQLite 文章示例 REST 插件。 */
export const bunSqliteRouter = new Elysia({ prefix: '/api/bun-sqlite' })
    .use(createPublicApiLayer())
    .post(
        '/article/',
        ({ body }) => SqliteArticleService.insert(body),
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
        ({ query }) => SqliteArticleService.getList({ page: query.page || 1, limit: query.limit || 10 }), {
            query: 'other.page',
        },
    )
    .delete(
        '/article/:id',
        ({ params: { id } }) => SqliteArticleService.deletes({ id }),
        {
            params: t.Object({
                id: tt.Numeric('文章ID'),
            }),
        },
    )
    .get(
        '/article/:id',
        ({ params: { id } }) => SqliteArticleService.getItem(id),
        {
            params: t.Object({
                id: tt.Numeric('文章ID'),
            }),
        },
    )
    .put(
        '/article/:id',
        ({ params: { id }, body }) => SqliteArticleService.modify({ id, ...body }),
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
    .all('/*', () => {
        throw new ApiError(API_CODE.NOT_FOUND, '接口不存在')
    })
