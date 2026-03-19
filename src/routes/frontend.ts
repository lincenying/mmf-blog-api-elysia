import { Elysia } from 'elysia'

import { createCorsConfig } from '@/plugins'
import { checkJWT } from '@/utils/check-jwt'
import { ApiError } from '~/types'
import * as frontendArticleHelper from '../api/frontend-article'

import * as frontendCommentHelper from '../api/frontend-comment'

import * as frontendLikeHelper from '../api/frontend-like'
import * as frontendUserHelper from '../api/frontend-user'
import { validationModel } from '../models/validation-schema'

export const frontendRouter = new Elysia({ prefix: '/api/frontend' })
    .use(createCorsConfig())
    .use(validationModel)
    .guard({ cookie: 'cookies' })
    .get('/article/list', async ({ query, cookie }) => {
        return await frontendArticleHelper.getList(query, cookie.userid.value)
    }, {
        query: 'article.search',
    })
    .get('/article/item', async ({ query, cookie }) => {
        return await frontendArticleHelper.getItem(query, cookie.userid.value)
    }, {
        query: 'id',
    })
    .get('/trending', async ({ query }) => {
        return await frontendArticleHelper.getTrending(query)
    }, {
        query: 'id',
    })
    .get('/comment/list', async ({ query }) => {
        return await frontendCommentHelper.getList(query)
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
                return await frontendCommentHelper.deletes(query)
            }, {
                query: 'id',
            })
            .get('/comment/recover', async ({ query }) => {
                return await frontendCommentHelper.recover(query)
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
                return await frontendCommentHelper.insert(body, cookie.userid.value)
            }, {
                body: 'comment.insert',
            })
            .post('/user/account', async ({ body, cookie }) => {
                return await frontendUserHelper.account(body, cookie.userid.value)
            }, {
                body: 'user.account',
            })
            .post('/user/password', async ({ body, cookie }) => {
                return await frontendUserHelper.password(body, cookie.userid.value)
            }, {
                body: 'user.password',
            })
            .get('/like', async ({ query, cookie }) => {
                return await frontendLikeHelper.like(query, cookie.userid.value)
            }, {
                query: 'id',
            })
            .get('/unlike', async ({ query, cookie }) => {
                return await frontendLikeHelper.unlike(query, cookie.userid.value)
            }, {
                query: 'id',
            })
            .get('/reset/like', async () => {
                return await frontendLikeHelper.resetLike()
            }, {
                query: 'id',
            }),
    )
    .post('/user/insert', async ({ body }) => {
        return await frontendUserHelper.insert(body)
    }, {
        body: 'user.insert',
    })
    .post('/user/login', async ({ body, cookie }) => {
        const json = await frontendUserHelper.login(body)
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
        return frontendUserHelper.logout()
    })
