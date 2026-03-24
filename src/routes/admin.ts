import { html } from '@elysiajs/html'
import { Elysia } from 'elysia'

import { AdminTemplateController } from '~/controllers/admin-template.controller'
import { validationSchema } from '~/schema/validation-schema'

export const adminRouter = new Elysia({ prefix: '/backend' })
    .use(validationSchema)
    .use(html())
    .get('/', async () => {
        return await AdminTemplateController.getAdminTemplate()
    })
    .post('/', async ({ body }) => {
        return await AdminTemplateController.postAdminTemplate(body)
    }, {
        body: 'user.insert',
    })
    .get('/chat', async () => {
        return await AdminTemplateController.chatTemplate()
    })
    .get('/send', ({ server }) => {
        server?.publish('general', JSON.stringify({ message: 'hello', name: 'lincenying', time: new Date() }))
        return '发送成功'
    })
