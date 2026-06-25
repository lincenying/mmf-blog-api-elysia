import md5 from 'md5'
import { beforeAll } from 'vitest'

import { config } from '~/config'
import mongoose from '~/db/mongoose'
import AdminM from '~/db/schema/admin.schema'
import ArticleM from '~/db/schema/article.schema'
import CategoryM from '~/db/schema/category.schema'
import UserM from '~/db/schema/user.schema'
import { getNowTime } from '~/utils'
import { signSessionToken } from '~/utils/jwt-token'

/** Vitest 专用测试账号（写入真实 MongoDB，便于登录接口测试）。 */
export const TEST_PASSWORD = 'vitest123456'
export const TEST_ADMIN_USERNAME = '__vitest_admin__'
export const TEST_USER_USERNAME = '__vitest_user__'
export const TEST_COMMENT_MARKER = '__vitest_comment__'

export interface ITestAccount {
    id: string
    username: string
    password: string
}

export interface ITestFixtures {
    admin: ITestAccount
    user: ITestAccount
    article: { id: string, title: string }
    categoryCount: number
}

let fixtures: ITestFixtures | null = null

/**
 * 等待 Mongoose 与 MongoDB 建立连接。
 */
export async function ensureDbReady(): Promise<void> {
    const mongoUri = `${config.db.mongo_uri}/${config.db.mongo_db}`

    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri)
    }

    if (mongoose.connection.readyState === 2) {
        await mongoose.connection.asPromise()
    }
}

/**
 * 创建或更新 Vitest 专用测试账号。
 */
async function upsertTestAccount(
    model: typeof AdminM | typeof UserM,
    username: string,
): Promise<ITestAccount> {
    const passwordHash = md5(config.md5_salt + TEST_PASSWORD)
    const now = getNowTime()
    const timestamp = Number(getNowTime('X'))

    const doc = await model.findOneAndUpdate(
        { username, is_delete: 0 },
        {
            $set: {
                username,
                password: passwordHash,
                email: `${username}@vitest.local`,
                update_date: now,
                timestamp,
            },
            $setOnInsert: {
                creat_date: now,
                is_delete: 0,
            },
        },
        { upsert: true, returnDocument: 'after', lean: true },
    )

    if (!doc) {
        throw new Error(`Failed to upsert test user: ${username}`)
    }

    return {
        id: doc._id.toString(),
        username,
        password: TEST_PASSWORD,
    }
}

/**
 * 加载测试夹具：专用账号 + 库内已有文章/分类数据。
 */
export async function getTestFixtures(): Promise<ITestFixtures> {
    if (fixtures) {
        return fixtures
    }

    await ensureDbReady()

    const [admin, user, article, categoryCount] = await Promise.all([
        upsertTestAccount(AdminM, TEST_ADMIN_USERNAME),
        upsertTestAccount(UserM, TEST_USER_USERNAME),
        ArticleM.findOne({ is_delete: 0 }).sort('-visit').lean(),
        CategoryM.countDocuments(),
    ])

    if (!article) {
        throw new Error('MongoDB 中缺少可用文章，无法运行接口测试')
    }

    fixtures = {
        admin,
        user,
        article: {
            id: article._id.toString(),
            title: article.title,
        },
        categoryCount,
    }

    return fixtures
}

/**
 * 在所有测试文件运行前预加载夹具。
 */
beforeAll(async () => {
    await getTestFixtures()
}, 30000)

/**
 * 清理 Vitest 写入的评论数据，避免污染业务库。
 */
export async function cleanupVitestComments(articleId: string, userId: string): Promise<void> {
    const CommentM = (await import('~/db/schema/comment.schema')).default

    const removed = await CommentM.deleteMany({
        article_id: articleId,
        userid: userId,
        content: TEST_COMMENT_MARKER,
    })

    if (removed.deletedCount > 0) {
        await ArticleM.updateOne(
            { _id: articleId },
            { $inc: { comment_count: -removed.deletedCount } },
        )
    }
}

interface ILoginRequestOptions {
    method?: string
    path: string
    body?: unknown
    cookie?: Record<string, string>
}

type TRequestFn = <T>(options: ILoginRequestOptions) => Promise<{ json: { code: number, data?: T, message?: string } }>

/**
 * 通过后台登录接口校验账号，并生成与 MongoDB _id 一致的管理员 Cookie。
 */
export async function loginAdminViaApi(
    request: TRequestFn,
    testFixtures: ITestFixtures,
): Promise<Record<string, string>> {
    const { json } = await request<{ user: string, userid: string, username: string }>({
        method: 'POST',
        path: '/api/backend/admin/login',
        body: {
            username: testFixtures.admin.username,
            password: testFixtures.admin.password,
        },
    })

    if (json.code !== 200 || !json.data) {
        throw new Error(`测试管理员登录失败: ${json.message ?? 'unknown'}`)
    }

    const username = json.data.username
    const token = signSessionToken({ id: testFixtures.admin.id, username }, 'admin')

    return {
        b_user: token,
        b_userid: testFixtures.admin.id,
        b_username: username,
    }
}

/**
 * 通过前台登录接口校验账号，并生成与 MongoDB _id 一致的用户 Cookie。
 */
export async function loginUserViaApi(
    request: TRequestFn,
    testFixtures: ITestFixtures,
): Promise<Record<string, string>> {
    const { json } = await request<{ user: string, userid: string, username: string }>({
        method: 'POST',
        path: '/api/frontend/user/login',
        body: {
            username: testFixtures.user.username,
            password: testFixtures.user.password,
        },
    })

    if (json.code !== 200 || !json.data) {
        throw new Error(`测试用户登录失败: ${json.message ?? 'unknown'}`)
    }

    const username = json.data.username
    const token = signSessionToken({ id: testFixtures.user.id, username }, 'user')

    return {
        user: token,
        userid: testFixtures.user.id,
        username,
    }
}
