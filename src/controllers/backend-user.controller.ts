import { BackendUserModel } from '~/models/backend-user.model'

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
