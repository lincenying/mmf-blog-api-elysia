import { Elysia } from 'elysia'

import { responseWrapperMiddleware } from '~/middleware/response-wrapper'
import { PostgreFrontendUserModel } from '~/models/postgre/frontend-user.model'
import { createCorsConfig } from '~/plugins'
import { validationSchema } from '~/schema/elysia-schema'

export const postgreRouter = new Elysia({ prefix: '/api/postgre' })
    .use(createCorsConfig())
    .use(validationSchema)
    .use(responseWrapperMiddleware)
    // 创建用户
    .post('/users', async ({ body }) => {
        return await PostgreFrontendUserModel.insert(body)
    }, {
        body: 'user.insert',
    })

    // 获取所有用户
    .get('/users', async ({ query }) => {
        return await PostgreFrontendUserModel.getList(query)
    }, {
        query: 'other.page',
    })

    // 获取单个用户
    .get('/users/:id', async ({ params }) => {
        return await PostgreFrontendUserModel.getItem(params.id)
    }, {
        params: 'id',
    })

    // 更新用户
    .put('/users/:id', async ({ params, body }) => {
        return await PostgreFrontendUserModel.modify({
            ...params,
            ...body,
        })
    }, {
        params: 'id',
        body: 'user.modify',
    })

    // 删除用户
    .put('/users/delete/:id', async ({ params }) => {
        return await PostgreFrontendUserModel.deletes(params)
    }, {
        params: 'id',
    })

    // 恢复用户
    .put('/users/recover/:id', async ({ params }) => {
        return await PostgreFrontendUserModel.recover(params)
    }, {
        params: 'id',
    })
