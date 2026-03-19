import { Elysia } from 'elysia'

import { createCorsConfig } from '@/plugins'
import { checkJWT } from '@/utils/check-jwt'
import * as backendArticleHelper from '../api/backend-article'
import * as backendCategoryHelper from '../api/backend-category'

import * as backendUserHelper from '../api/backend-user'
import * as frontendUserHelper from '../api/frontend-user'
import { validationModel } from '../models/validation-schema'

export const backendRouter = new Elysia({ prefix: '/api/backend' })
    .use(createCorsConfig())
    .use(validationModel)
    .onError(({ error, code }) => {
        if (code === 'VALIDATION') {
            return {
                code: 422,
                message: error,
                data: '',
            }
        }
    })
    .guard({ cookie: 'cookies' })
    .guard({
        beforeHandle: async ({ cookie: { b_user, b_userid, b_username } }) => {
            const check = await checkJWT(b_user.value, b_userid.value, b_username.value, 'admin')
            if (!check) {
                return {
                    code: -400,
                    message: '登录验证失败',
                    data: '',
                }
            }
        },
    }, app =>
        app
            .get('/article/list', async ({ query }) => {
                return await backendArticleHelper.getList(query)
            }, {
                query: 'article.page',
            })
            .get('/article/item', async ({ query }) => {
                return await backendArticleHelper.getItem(query)
            }, {
                query: 'id',
            })
            .post('/article/insert', async ({ body }) => {
                return await backendArticleHelper.insert(body)
            }, {
                body: 'article.insert',
            })
            .post('/article/modify', async ({ body }) => {
                return await backendArticleHelper.modify(body)
            }, {
                body: 'article.modify',
            })
            .get('/article/delete', async ({ query }) => {
                return await backendArticleHelper.deletes(query)
            }, {
                query: 'id',
            })
            .get('/article/recover', async ({ query }) => {
                return await backendArticleHelper.recover(query)
            }, {
                query: 'id',
            })
            .post('/category/insert', async ({ body }) => {
                return await backendCategoryHelper.insert(body)
            }, {
                body: 'category.insert',
            })
            .post('/category/modify', async ({ body }) => {
                return await backendCategoryHelper.modify(body)
            }, {
                body: 'category.modify',
            })
            .get('/category/delete', async ({ query }) => {
                return await backendCategoryHelper.deletes(query)
            }, {
                query: 'id',
            })
            .get('/category/recover', async ({ query }) => {
                return await backendCategoryHelper.recover(query)
            }, {
                query: 'id',
            })
            .get('/admin/list', async ({ query }) => {
                return await backendUserHelper.getList(query)
            }, {
                query: 'user.page',
            })
            .get('/admin/item', async ({ query }) => {
                return await backendUserHelper.getItem(query)
            }, {
                query: 'id',
            })
            .post('/admin/modify', async ({ body }) => {
                return await backendUserHelper.modify(body)
            }, {
                body: 'user.modify',
            })
            .get('/admin/delete', async ({ query }) => {
                return await backendUserHelper.deletes(query)
            }, {
                query: 'id',
            })
            .get('/admin/recover', async ({ query }) => {
                return await backendUserHelper.recover(query)
            }, {
                query: 'id',
            })
            .get('/user/list', async ({ query }) => {
                return await frontendUserHelper.getList(query)
            }, {
                query: 'user.page',
            })
            .get('/user/item', async ({ query, cookie }) => {
                const userid = query.id || cookie.userid.value || ''
                return await frontendUserHelper.getItem(userid)
            }, {
                query: 'id',
            })
            .post('/user/modify', async ({ body }) => {
                return await frontendUserHelper.modify(body)
            }, {
                body: 'user.modify',
            })
            .get('/user/delete', async ({ query }) => {
                return await frontendUserHelper.deletes(query)
            }, {
                query: 'id',
            })
            .get('/user/recover', async ({ query }) => {
                return await frontendUserHelper.recover(query)
            }, {
                query: 'id',
            }),
    )
    .get('/category/list', async () => {
        return await backendCategoryHelper.getList()
    })
    .get('/category/item', async ({ query }) => {
        return await backendCategoryHelper.getItem(query)
    }, {
        query: 'id',
    })
    .post('/admin/login', async ({ body, cookie }) => {
        const json = await backendUserHelper.login(body)
        if (json.code === 200 && json.data) {
            const { user, userid, username } = json.data
            cookie.b_user.value = user
            cookie.b_userid.value = userid
            cookie.b_username.value = username
            cookie.b_user.maxAge = 60 * 60 * 24 * 30
            cookie.b_userid.maxAge = 60 * 60 * 24 * 30
            cookie.b_username.maxAge = 60 * 60 * 24 * 30
        }
        return json
    }, {
        body: 'user.login',
    })
    .get('/admin/logout', async ({ cookie }) => {
        cookie.b_user.remove()
        cookie.b_userid.remove()
        cookie.b_username.remove()
        return backendUserHelper.logout()
    })
