import { Elysia, t } from 'elysia'

export const validationSchema = new Elysia()
    .model({
        // 登录cookies
        'cookies': t.Partial(
            t.Cookie({
                user: t.String(),
                userid: t.String(),
                username: t.String(),
                b_user: t.String(),
                b_userid: t.String(),
                b_username: t.String(),
            }),
        ),
        'id': t.Object({
            id: t.String({
                minLength: 24,
                maxLength: 24,
                error: 'ID必须是合法的字符串',
            }),
        }),
        // 文章搜索条件
        'article.search': t.Partial(
            t.Object({
                by: t.String(),
                id: t.String(),
                key: t.String(),
                filter: t.String(),
            }),
        ),
        'other.page': t.Partial(
            t.Object({
                page: t.Number(),
                limit: t.Number(),
            }),
        ),

        // 文章列表分页
        'article.page': t.Partial(
            t.Object({
                page: t.String(),
                limit: t.String(),
                sort: t.String(),
                key: t.String(),
            }),
        ),
        // 发布文章
        'article.insert': t.Object({
            category: t.String(),
            content: t.String(),
            title: t.String(),
            html: t.String(),
        }),
        // 修改文章
        'article.modify': t.Object({
            id: t.String(),
            category_old: t.String(),
            category_name: t.String(),
            category: t.String(),
            content: t.String(),
            title: t.String(),
            html: t.String(),
        }),

        // 新增分类
        'category.insert': t.Object({
            cate_name: t.String(),
            cate_order: t.String(),
        }),
        // 修改分类
        'category.modify': t.Object({
            id: t.String(),
            cate_name: t.String(),
            cate_order: t.String(),
        }),

        // 发表评论
        'comment.insert': t.Object({
            id: t.String(),
            content: t.String(),
        }),

        // 注册用户
        'user.insert': t.Object({
            email: t.String({
                format: 'email',
                error: '无效的电子邮件 :(',
            }),
            password: t.String(),
            username: t.String(),
        }),
        // 登录用户
        'user.login': t.Object({
            password: t.String(),
            username: t.String(),
        }),
        // 修改用户信息
        'user.account': t.Object({
            email: t.String({
                format: 'email',
                error: '无效的电子邮件 :(',
            }),
        }),
        // 修改密码
        'user.password': t.Object({
            old_password: t.String(),
            password: t.String(),
        }),
        // 修改用户信息
        'user.modify': t.Object({
            id: t.String(),
            email: t.String({
                format: 'email',
                error: '无效的电子邮件 :(',
            }),
            password: t.String(),
            username: t.String(),
        }),
    })
