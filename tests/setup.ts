import { accessSync, constants, writeFileSync } from 'node:fs'

/**
 * 确保测试环境存在 JWT 密钥文件，避免导入 config 时失败。
 */
function ensureTestSecrets() {
    try {
        accessSync('./src/config/_secret.js', constants.F_OK)
    }
    catch {
        writeFileSync('./src/config/_secret.js', `
export const secretServer = 'test-secret-server'
export const secretClient = 'test-secret-client'
`)
    }
}

ensureTestSecrets()

process.env.NODE_ENV = 'test'
