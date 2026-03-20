import { jwt } from '@elysiajs/jwt'
import { Elysia, t } from 'elysia'

import { secretClient } from '~/config'

import { ApiError } from '~/types'

export const jwtRouter = new Elysia({ prefix: '/api/jwt' })
    .use(jwt({
        name: 'jwt',
        secret: secretClient,
    }))
    .get('/sign/:name', async ({ jwt, cookie: { auth }, params }) => {
        auth.set({
            value: await jwt.sign(params),
            maxAge: 60 * 60 * 24 * 30,
            httpOnly: true,
        })

        return `Sign in as ${params.name}`
    })
    .get('/profile', async ({ jwt, set, cookie: { auth } }) => {
        const profile = await jwt.verify(auth.value)

        if (!profile) {
            set.status = 401
            return 'Unauthorized'
        }

        return `Hello ${profile.name}`
    }, {
        cookie: t.Object({
            auth: t.Optional(t.String()),
        }),
    })
    .all('/*', async () => {
        throw new ApiError(404, '接口不存在')
    })
