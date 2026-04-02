import type { OtherPage, UserInsert, UserLogin, UserModify } from '~/schema/elysia-schema'
import { BackendUserModel } from '~/models/backend-user.model'
import { fsExistsSync } from '~/utils'

export class BackendUserController {
    public static async getList(reqQuery: OtherPage) {
        return BackendUserModel.getList(reqQuery)
    }

    public static async getItem(reqQuery: { id: string }) {
        return BackendUserModel.getItem(reqQuery)
    }

    public static async login(reqBody: UserLogin) {
        return BackendUserModel.login(reqBody)
    }

    public static async logout() {
        return BackendUserModel.logout()
    }

    public static async insert(reqBody: UserInsert) {
        if (!reqBody.username || !reqBody.password || !reqBody.email) {
            return '请将表单填写完整'
        }
        if (fsExistsSync('./admin.lock')) {
            return '请先把项目根目录的 admin.lock 文件删除'
        }
        return BackendUserModel.insert(reqBody)
    }

    public static async modify(reqBody: UserModify) {
        return BackendUserModel.modify(reqBody)
    }

    public static async deletes(reqQuery: { id: string }) {
        return BackendUserModel.deletes(reqQuery)
    }

    public static async recover(reqQuery: { id: string }) {
        return BackendUserModel.recover(reqQuery)
    }
}
