import { Elysia } from 'elysia'

import { createCorsConfig } from '@/plugins'
import { checkJWT } from '@/utils/check-jwt'
import { FrontendArticleController } from '~/controllers/frontend-article.controller'
import { ApiError, responseWrapperMiddleware } from '~/middleware/response-wrapper'

import { FrontendCommentModel } from '~/models/frontend-comment.model'
import { FrontendLikeModel } from '~/models/frontend-like.model'
import { FrontendUserModel } from '~/models/frontend-user.model'
import { validationSchema } from '../schema/validation-schema'

export const frontendRouter = new Elysia({ prefix: '/api/frontend' })
    .use(createCorsConfig())
    .use(validationSchema)
    .use(responseWrapperMiddleware)
    .guard({ cookie: 'cookies' })
    .get('/article/list', async ({ query, cookie }) => {
        return await FrontendArticleController.getList(query, cookie.userid.value)
    }, {
        query: 'article.search',
    })
    .get('/article/item', async ({ query, cookie }) => {
        return await FrontendArticleController.getItem(query, cookie.userid.value)
    }, {
        query: 'id',
    })
    .get('/trending', async ({ query }) => {
        return await FrontendArticleController.getTrending(query)
    }, {
        query: 'id',
    })
    .get('/comment/list', async ({ query }) => {
        return await FrontendCommentModel.getList(query)
    }, {
        query: 'id',
    })
    .guard({
        beforeHandle: async ({ cookie: { b_user, b_userid, b_username } }) => {
            const check = await checkJWT(b_user.value, b_userid.value, b_username.value, 'admin')
            if (!check) {
                throw new ApiError(403, '登录验证失败')
            }
        },
    }, app =>
        app
            .get('/comment/delete', async ({ query }) => {
                return await FrontendCommentModel.deletes(query)
            }, {
                query: 'id',
            })
            .get('/comment/recover', async ({ query }) => {
                return await FrontendCommentModel.recover(query)
            }, {
                query: 'id',
            }),
    )
    .guard({
        beforeHandle: async ({ cookie: { user, userid, username } }) => {
            const check = await checkJWT(user.value, userid.value, username.value, 'user')
            if (!check) {
                throw new ApiError(403, '登录验证失败')
            }
        },
    }, app =>
        app
            .post('/comment/insert', async ({ body, cookie }) => {
                return await FrontendCommentModel.insert(body, cookie.userid.value)
            }, {
                body: 'comment.insert',
            })
            .post('/user/account', async ({ body, cookie }) => {
                return await FrontendUserModel.account(body, cookie.userid.value)
            }, {
                body: 'user.account',
            })
            .post('/user/password', async ({ body, cookie }) => {
                return await FrontendUserModel.password(body, cookie.userid.value)
            }, {
                body: 'user.password',
            })
            .get('/like', async ({ query, cookie }) => {
                return await FrontendLikeModel.like(query, cookie.userid.value)
            }, {
                query: 'id',
            })
            .get('/unlike', async ({ query, cookie }) => {
                return await FrontendLikeModel.unlike(query, cookie.userid.value)
            }, {
                query: 'id',
            })
            .get('/reset/like', async () => {
                return await FrontendLikeModel.resetLike()
            }, {
                query: 'id',
            }),
    )
    .post('/user/insert', async ({ body }) => {
        return await FrontendUserModel.insert(body)
    }, {
        body: 'user.insert',
    })
    .post('/user/login', async ({ body, cookie }) => {
        const json = await FrontendUserModel.login(body)
        const { user, userid, username, useremail } = json
        cookie.user.value = user
        cookie.userid.value = userid
        cookie.username.value = username
        cookie.useremail.value = useremail
        cookie.user.maxAge = 60 * 60 * 24 * 30
        cookie.userid.maxAge = 60 * 60 * 24 * 30
        cookie.username.maxAge = 60 * 60 * 24 * 30
        cookie.useremail.maxAge = 60 * 60 * 24 * 30
        return json
    }, {
        body: 'user.login',
    })
    .get('/user/logout', async ({ cookie }) => {
        cookie.user.remove()
        cookie.userid.remove()
        cookie.username.remove()
        cookie.useremail.remove()
        return FrontendUserModel.logout()
    })
    .all('/*', async () => {
        throw new ApiError(404, '接口不存在')
    })
