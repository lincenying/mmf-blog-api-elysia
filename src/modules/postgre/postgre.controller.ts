import { Elysia } from 'elysia'

import { createPublicApiLayer } from '~/plugins'

import { PostgreUserService } from './postgre-user.service'

/** PostgreSQL（Drizzle）示例用户 REST 插件。 */
export const postgreRouter = new Elysia({ prefix: '/api/postgre' })
    .use(createPublicApiLayer())
    .post('/users', async ({ body }) => {
        return await PostgreUserService.insert(body)
    }, {
        body: 'user.insert',
    })
    .get('/users', async ({ query }) => {
        return await PostgreUserService.getList(query)
    }, {
        query: 'other.page',
    })
    .get('/users/:id', async ({ params }) => {
        return await PostgreUserService.getItem(params.id)
    }, {
        params: 'id',
    })
    .put('/users/:id', async ({ params, body }) => {
        return await PostgreUserService.modify({
            ...params,
            ...body,
        })
    }, {
        params: 'id',
        body: 'user.modify',
    })
    .put('/users/delete/:id', async ({ params }) => {
        return await PostgreUserService.deletes(params)
    }, {
        params: 'id',
    })
    .put('/users/recover/:id', async ({ params }) => {
        return await PostgreUserService.recover(params)
    }, {
        params: 'id',
    })
