import { FrontendUserModel } from '~/models/frontend-user.model'

export class FrontendUserController {
    public static async getList(reqQuery: { page?: number, limit?: number }) {
        return FrontendUserModel.getList(reqQuery)
    }

    public static async login(reqBody: { username: string, password: string }) {
        return FrontendUserModel.login(reqBody)
    }

    public static async logout() {
        return FrontendUserModel.logout()
    }

    public static async insert(reqBody: { email: string, password: string, username: string }) {
        return FrontendUserModel.insert(reqBody)
    }

    public static async getItem(userid: string) {
        return FrontendUserModel.getItem(userid)
    }

    public static async modify(reqBody: { id: string, email: string, password: string, username: string }) {
        return FrontendUserModel.modify(reqBody)
    }

    public static async account(reqBody: { email: string }, user_id?: string) {
        return FrontendUserModel.account(reqBody, user_id)
    }

    public static async password(reqBody: { old_password: string, password: string }, user_id?: string) {
        return FrontendUserModel.password(reqBody, user_id)
    }

    public static async deletes(reqQuery: { id: string }) {
        return FrontendUserModel.deletes(reqQuery)
    }

    public static async recover(reqQuery: { id: string }) {
        return FrontendUserModel.recover(reqQuery)
    }
}
