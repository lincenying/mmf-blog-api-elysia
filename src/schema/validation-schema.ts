import { Elysia, t } from 'elysia'

import { tt } from './validation-schema-error'

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
            id: tt.String('ID', {
                minLength: 24,
                maxLength: 24,
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
            category: tt.String('分类'),
            content: tt.String('内容'),
            title: tt.String('标题'),
            html: tt.String('HTML'),
        }),
        // 修改文章
        'article.modify': t.Object({
            id: tt.String('ID'),
            category_old: tt.String('旧分类'),
            category_name: tt.String('新分类'),
            category: tt.String('分类'),
            content: tt.String('内容'),
            title: tt.String('标题'),
            html: tt.String('HTML'),
        }),

        // 新增分类
        'category.insert': t.Object({
            cate_name: tt.String('分类名称'),
            cate_order: tt.String('分类排序'),
        }),
        // 修改分类
        'category.modify': t.Object({
            id: t.String(),
            cate_name: tt.String('分类名称'),
            cate_order: tt.String('分类排序'),
        }),

        // 发表评论
        'comment.insert': t.Object({
            id: tt.String('文章ID'),
            content: tt.String('评论内容'),
        }),

        // 注册用户
        'user.insert': t.Object({
            email: tt.String('邮箱', {
                format: 'email',
            }),
            password: tt.String('密码'),
            username: tt.String('用户名'),
        }),
        // 登录用户
        'user.login': t.Object({
            password: tt.String('密码'),
            username: tt.String('用户名'),
        }),
        // 修改用户信息
        'user.account': t.Object({
            email: tt.String('邮箱', {
                format: 'email',
            }),

        }),
        // 修改密码
        'user.password': t.Object({
            old_password: tt.String('旧密码'),
            password: tt.String('新密码'),
        }),
        // 修改用户信息
        'user.modify': t.Object({
            id: tt.String('ID'),
            email: tt.String('邮箱', {
                format: 'email',
            }),
            password: tt.String('密码'),
            username: tt.String('用户名'),
        }),
    })
