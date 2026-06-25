import { describe, expect, it } from 'vitest'

import { signSessionToken } from '~/utils/jwt-token'
import { checkJWT } from '~/utils/check-jwt'

describe('checkJWT', () => {
    it('空凭证时返回 false', () => {
        expect(checkJWT('', '', '', 'user')).toBe(false)
        expect(checkJWT('', '', '', 'admin')).toBe(false)
    })

    it('token 与 userid、username 一致时返回 true', () => {
        const userid = '507f1f77bcf86cd799439011'
        const username = 'testuser'
        const token = signSessionToken({ id: userid, username }, 'user')

        expect(checkJWT(token, userid, username, 'user')).toBe(true)
    })

    it('userid 不匹配时返回 false', () => {
        const token = signSessionToken({ id: '507f1f77bcf86cd799439011', username: 'testuser' }, 'user')

        expect(checkJWT(token, '507f1f77bcf86cd799439012', 'testuser', 'user')).toBe(false)
    })
})
