import { Elysia } from 'elysia'

import { createCorsConfig } from '@/plugins'
import { BackendArticleController } from '~/controllers/backend-article.controller'
import { BackendCategoryController } from '~/controllers/backend-category.controller'
import { BackendUserController } from '~/controllers/backend-user.controller'
import { ApiError, responseWrapperMiddleware } from '~/middleware/response-wrapper'
import { FrontendUserModel } from '~/models/frontend-user.model'
import { validationSchema } from '~/schema/validation-schema'
import { checkJWT } from '~/utils/check-jwt'

export const backendRouter = new Elysia({ prefix: '/api/backend' })
    .use(createCorsConfig())
    .use(validationSchema)
    .use(responseWrapperMiddleware)
    .guard({ cookie: 'cookies' })
    .guard({
        beforeHandle: async ({ cookie: { b_user, b_userid, b_username } }) => {
            const check = await checkJWT(b_user.value, b_userid.value, b_username.value, 'admin')
            if (!check) {
                throw new ApiError(403, '登录验证失败')
            }
        },
    }, app =>
        app
            .get('/article/list', async ({ query }) => {
                return await BackendArticleController.getList(query)
            }, {
                query: 'article.page',
            })
            .get('/article/item', async ({ query }) => {
                return await BackendArticleController.getItem(query)
            }, {
                query: 'id',
            })
            .post('/article/insert', async ({ body }) => {
                return await BackendArticleController.insert(body)
            }, {
                body: 'article.insert',
            })
            .post('/article/modify', async ({ body }) => {
                return await BackendArticleController.modify(body)
            }, {
                body: 'article.modify',
            })
            .get('/article/delete', async ({ query }) => {
                return await BackendArticleController.deletes(query)
            }, {
                query: 'id',
            })
            .get('/article/recover', async ({ query }) => {
                return await BackendArticleController.recover(query)
            }, {
                query: 'id',
            })
            .post('/category/insert', async ({ body }) => {
                return await BackendCategoryController.insert(body)
            }, {
                body: 'category.insert',
            })
            .post('/category/modify', async ({ body }) => {
                return await BackendCategoryController.modify(body)
            }, {
                body: 'category.modify',
            })
            .get('/category/delete', async ({ query }) => {
                return await BackendCategoryController.deletes(query)
            }, {
                query: 'id',
            })
            .get('/category/recover', async ({ query }) => {
                return await BackendCategoryController.recover(query)
            }, {
                query: 'id',
            })
            .get('/admin/list', async ({ query }) => {
                return await BackendUserController.getList(query)
            }, {
                query: 'other.page',
            })
            .get('/admin/item', async ({ query }) => {
                return await BackendUserController.getItem(query)
            }, {
                query: 'id',
            })
            .post('/admin/modify', async ({ body }) => {
                return await BackendUserController.modify(body)
            }, {
                body: 'user.modify',
            })
            .get('/admin/delete', async ({ query }) => {
                return await BackendUserController.deletes(query)
            }, {
                query: 'id',
            })
            .get('/admin/recover', async ({ query }) => {
                return await BackendUserController.recover(query)
            }, {
                query: 'id',
            })
            .get('/user/list', async ({ query }) => {
                return await FrontendUserModel.getList(query)
            }, {
                query: 'other.page',
            })
            .get('/user/item', async ({ query, cookie }) => {
                const userid = query.id || cookie.userid.value || ''
                return await FrontendUserModel.getItem(userid)
            }, {
                query: 'id',
            })
            .post('/user/modify', async ({ body }) => {
                return await FrontendUserModel.modify(body)
            }, {
                body: 'user.modify',
            })
            .get('/user/delete', async ({ query }) => {
                return await FrontendUserModel.deletes(query)
            }, {
                query: 'id',
            })
            .get('/user/recover', async ({ query }) => {
                return await FrontendUserModel.recover(query)
            }, {
                query: 'id',
            }),
    )
    .get('/category/list', async () => {
        return await BackendCategoryController.getList()
    })
    .get('/category/item', async ({ query }) => {
        return await BackendCategoryController.getItem(query)
    }, {
        query: 'id',
    })
    .post('/admin/login', async ({ body, cookie }) => {
        const json = await BackendUserController.login(body)
        const { user, userid, username } = json
        cookie.b_user.value = user
        cookie.b_userid.value = userid
        cookie.b_username.value = username
        cookie.b_user.maxAge = 60 * 60 * 24 * 30
        cookie.b_userid.maxAge = 60 * 60 * 24 * 30
        cookie.b_username.maxAge = 60 * 60 * 24 * 30
        return json
    }, {
        body: 'user.login',
    })
    .get('/admin/logout', async ({ cookie }) => {
        cookie.b_user.remove()
        cookie.b_userid.remove()
        cookie.b_username.remove()
        return BackendUserController.logout()
    })
    .all('/*', async () => {
        throw new ApiError(404, '接口不存在')
    })
