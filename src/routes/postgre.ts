import { count, desc, eq } from 'drizzle-orm'
import { Elysia, t } from 'elysia'

import { ApiError, responseWrapperMiddleware } from '~/middleware/response-wrapper'
import { createCorsConfig } from '~/plugins'
import { validationSchema } from '~/schema/elysia-schema'
import { tt } from '~/schema/elysia-schema-error'
import { db } from '../db/postgre-sql'
import { users } from '../schema/postgre-sql'

export const postgreRouter = new Elysia({ prefix: '/postgre' })
    .use(createCorsConfig())
    .use(validationSchema)
    .use(responseWrapperMiddleware)
    // 创建用户
    .post('/users', async ({ body }) => {
        const newUser = await db.insert(users).values(body).returning()
        return newUser[0]
    }, {
        body: t.Object({
            username: tt.String('用户名', { minLength: 1 }),
            password: tt.String('密码', { minLength: 1 }),
            email: tt.String('邮箱', { format: 'email' }),
        }),
    })

    // 获取所有用户
    .get('/users', async ({ query }) => {
        const page = Math.max(1, query.page ?? 1)
        const limit = Math.min(100, Math.max(1, query.limit ?? 10))
        const offset = (page - 1) * limit
        const data = await db.select().from(users).orderBy(desc(users.creat_date)).limit(limit).offset(offset)

        const totalResult = await db.select({ value: count() }).from(users)
        const total = Number(totalResult[0]?.value) ?? 0
        const totalPages = Math.ceil(total / limit)

        return {
            list: data,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        }
    }, {
        query: t.Object({
            page: t.Optional(t.Numeric({ minimum: 1 })),
            limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
        }),
    })

    // 获取单个用户
    .get('/users/:id', async ({ params }) => {
        const user = await db.select().from(users).where(eq(users._id, params.id))
        if (!user.length) {
            throw new ApiError(201, '用户未找到')
        }
        return user[0]
    }, {
        params: t.Object({
            id: t.String(),
        }),
    })

    // 更新用户
    .put('/users/:id', async ({ params, body }) => {
        const updated = await db
            .update(users)
            .set(body)
            .where(eq(users._id, params.id))
            .returning()
        if (!updated.length) {
            throw new ApiError(201, '用户未找到')
        }
        return updated[0]
    }, {
        params: t.Object({
            id: t.String(),
        }),
        body: t.Object({
            username: t.Optional(tt.String('用户名', { minLength: 1 })),
            email: t.Optional(tt.String('邮箱', { format: 'email' })),
        }),
    })

    // 删除用户
    .put('/users/delete/:id', async ({ params }) => {
        const updated = await db
            .update(users)
            .set({
                is_delete: 1,
            })
            .where(eq(users._id, params.id))
            .returning()
        if (!updated.length) {
            throw new ApiError(201, '用户未找到')
        }
        return '删除成功'
    }, {
        params: t.Object({
            id: tt.String('用户ID'),
        }),
    })

    // 恢复用户
    .put('/users/recover/:id', async ({ params }) => {
        const updated = await db
            .update(users)
            .set({
                is_delete: 0,
            })
            .where(eq(users._id, params.id))
            .returning()
        if (!updated.length) {
            throw new ApiError(201, '用户未找到')
        }
        return '恢复成功'
    }, {
        params: t.Object({
            id: tt.String('用户ID'),
        }),
    })
