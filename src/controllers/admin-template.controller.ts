import Twig from 'twig'
import { getTemplateDir } from '~/utils'
import { BackendUserController } from './backend-user.controller'

export class AdminTemplateController {
    public static async getAdminTemplate() {
        const templateDir = getTemplateDir('./views/index.twig')
        const html = await new Promise<string>((resove) => {
            Twig.renderFile(templateDir, { title: '添加管理员', message: '' }, (err, html) => {
                resove(err ? err.toString() : html)
            })
        })
        return html
    }

    public static async postAdminTemplate(body: { email: string, password: string, username: string }) {
        let message = ''
        const { email, password, username } = body
        if (!email || !password || !username) {
            message = '请填写完整信息'
        }
        else {
            message = await BackendUserController.insert(email, password, username)
        }
        const templateDir = getTemplateDir('./views/index.twig')
        const html = await new Promise<string>((resove) => {
            Twig.renderFile(templateDir, { title: '添加管理员', message }, (err, html) => {
                resove(err ? err.toString() : html)
            })
        })
        return html
    }

    public static async chatTemplate() {
        const templateDir = getTemplateDir('./views/chat.twig')
        const html = await new Promise<string>((resove) => {
            Twig.renderFile(templateDir, { title: '聊天室', message: '' }, (err, html) => {
                resove(err ? err.toString() : html)
            })
        })
        return html
    }
}
