import { signSessionToken } from '~/utils/jwt-token'

const DEFAULT_USER_ID = '507f1f77bcf86cd799439011'

/**
 * 构造后台管理员会话 Cookie，供鉴权路由测试使用。
 */
export function buildAdminSessionCookies(
    userid: string = DEFAULT_USER_ID,
    username: string = 'admin',
) {
    const token = signSessionToken({ id: userid, username }, 'admin')

    return {
        b_user: token,
        b_userid: userid,
        b_username: username,
    }
}

/**
 * 构造前台用户会话 Cookie，供鉴权路由测试使用。
 */
export function buildUserSessionCookies(
    userid: string = DEFAULT_USER_ID,
    username: string = 'testuser',
) {
    const token = signSessionToken({ id: userid, username }, 'user')

    return {
        user: token,
        userid,
        username,
    }
}
