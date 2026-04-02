import { html } from '@elysiajs/html'
import { Elysia } from 'elysia'

import { AdminTemplateController } from '~/controllers/admin-template.controller'
import { validationSchema } from '~/schema/elysia-schema'

export const adminRouter = new Elysia({ prefix: '/backend' })
    .use(validationSchema)
    .use(html())
    .get('/', async () => {
        return await AdminTemplateController.getAdminTemplate()
    })
    .post('/', async (context) => {
        const body = context.body as {
            username: string
            email: string
            password: string
        }
        return await AdminTemplateController.postAdminTemplate(body)
    })
    .get('/chat', async () => {
        return await AdminTemplateController.chatTemplate()
    })
