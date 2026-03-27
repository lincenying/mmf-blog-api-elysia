import { BackendUserModel } from '~/models/backend-user.model'
import { fsExistsSync } from '~/utils'

export class BackendUserController {
    public static async getList(reqQuery: { page?: number, limit?: number }) {
        return BackendUserModel.getList(reqQuery)
    }

    public static async getItem(reqQuery: { id: string }) {
        return BackendUserModel.getItem(reqQuery)
    }

    public static async login(reqBody: { password: string, username: string }) {
        return BackendUserModel.login(reqBody)
    }

    public static async logout() {
        return BackendUserModel.logout()
    }

    public static async insert(email: string, password: string, username: string) {
        if (!username || !password || !email) {
            return '请将表单填写完整'
        }
        if (fsExistsSync('./admin.lock')) {
            return '请先把项目根目录的 admin.lock 文件删除'
        }
        return BackendUserModel.insert(email, password, username)
    }

    public static async modify(reqBody: { id: string, email: string, password: string, username: string }) {
        return BackendUserModel.modify(reqBody)
    }

    public static async deletes(reqQuery: { id: string }) {
        return BackendUserModel.deletes(reqQuery)
    }

    public static async recover(reqQuery: { id: string }) {
        return BackendUserModel.recover(reqQuery)
    }
}
