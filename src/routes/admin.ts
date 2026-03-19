import { html } from '@elysiajs/html'
import { Elysia } from 'elysia'
import Twig from 'twig'
import { validationModel } from '~/models/validation-schema'
import { getTemplateDir } from '~/utils'
import * as backendUserHelper from '../api/backend-user'

export const adminRouter = new Elysia({ prefix: '/backend' })
    .use(validationModel)
    // .onError(({ error, code }) => {
    //     if (code === 'VALIDATION') {
    //         return {
    //             code: 422,
    //             message: `${error.valueError?.path}: ${error.valueError?.message}`,
    //             data: '',
    //         }
    //     }
    // })
    .use(html())
    .get('/', async () => {
        const templateDir = getTemplateDir('./views/index.twig')
        const html = await new Promise<string>((resove) => {
            Twig.renderFile(templateDir, { title: '添加管理员', message: '' }, (err, html) => {
                resove(err ? err.toString() : html)
            })
        })
        return html
    })
    .post('/', async ({ body: { email, password, username } }) => {
        let message = ''
        if (!email || !password || !username) {
            message = '请填写完整信息'
        }
        else {
            message = await backendUserHelper.insert(email, password, username)
        }
        const templateDir = getTemplateDir('./views/index.twig')
        const html = await new Promise<string>((resove) => {
            Twig.renderFile(templateDir, { title: '添加管理员', message }, (err, html) => {
                resove(err ? err.toString() : html)
            })
        })
        return html
    }, {
        body: 'user.insert',
    })
