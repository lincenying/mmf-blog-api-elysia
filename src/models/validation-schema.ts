import { Elysia, t } from 'elysia'

export const validationSchema = new Elysia()
    .model({
        // 登录cookies
        'cookies': t.Object({
            user: t.Optional(t.String()),
            userid: t.Optional(t.String()),
            username: t.Optional(t.String()),
            b_user: t.Optional(t.String()),
            b_userid: t.Optional(t.String()),
            b_username: t.Optional(t.String()),
        }),
        'id': t.Object({
            id: t.String({
                minLength: 24,
                maxLength: 24,
                error: 'ID必须是合法的字符串',
            }),
        }),
        // 文章搜索条件
        'article.search': t.Object({
            by: t.Optional(t.String()),
            id: t.Optional(t.String()),
            key: t.Optional(t.String()),
            filter: t.Optional(t.String()),
        }),
        // 文章列表分页
        'article.page': t.Object({
            page: t.Optional(t.String()),
            limit: t.Optional(t.String()),
            sort: t.Optional(t.String()),
            key: t.Optional(t.String()),
        }),
        'user.page': t.Object({
            page: t.Optional(t.Number()),
            limit: t.Optional(t.Number()),
        }),
        'article.insert': t.Object({
            category: t.String(),
            content: t.String(),
            title: t.String(),
            html: t.String(),
        }),
        'article.modify': t.Object({
            id: t.String(),
            category_old: t.String(),
            category_name: t.String(),
            category: t.String(),
            content: t.String(),
            title: t.String(),
            html: t.String(),
        }),
        'category.insert': t.Object({
            cate_name: t.String(),
            cate_order: t.String(),
        }),
        'category.modify': t.Object({
            id: t.String(),
            cate_name: t.String(),
            cate_order: t.String(),
        }),
        'comment.insert': t.Object({
            id: t.String(),
            content: t.String(),
        }),
        'user.insert': t.Object({
            email: t.String(),
            password: t.String(),
            username: t.String(),
        }),

        'user.login': t.Object({
            password: t.String(),
            username: t.String(),
        }),

        'user.account': t.Object({
            email: t.String(),
        }),

        'user.password': t.Object({
            old_password: t.String(),
            password: t.String(),
        }),

        'user.modify': t.Object({
            id: t.String(),
            email: t.String(),
            password: t.String(),
            username: t.String(),
        }),
    })
