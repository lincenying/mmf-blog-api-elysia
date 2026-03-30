import type { OtherPage, UserInsert, UserLogin, UserModify, UserPassword } from '~/schema/validation-schema'
import { FrontendUserModel } from '~/models/frontend-user.model'

export class FrontendUserController {
    public static async getList(reqQuery: OtherPage) {
        return FrontendUserModel.getList(reqQuery)
    }

    public static async login(reqBody: UserLogin) {
        return FrontendUserModel.login(reqBody)
    }

    public static async logout() {
        return FrontendUserModel.logout()
    }

    public static async insert(reqBody: UserInsert) {
        return FrontendUserModel.insert(reqBody)
    }

    public static async getItem(userid: string) {
        return FrontendUserModel.getItem(userid)
    }

    public static async modify(reqBody: UserModify) {
        return FrontendUserModel.modify(reqBody)
    }

    public static async account(reqBody: { email: string }, user_id?: string) {
        return FrontendUserModel.account(reqBody, user_id)
    }

    public static async password(reqBody: UserPassword, user_id?: string) {
        return FrontendUserModel.password(reqBody, user_id)
    }

    public static async deletes(reqQuery: { id: string }) {
        return FrontendUserModel.deletes(reqQuery)
    }

    public static async recover(reqQuery: { id: string }) {
        return FrontendUserModel.recover(reqQuery)
    }
}
