import { html } from '@elysiajs/html'
import { Elysia } from 'elysia'

import { AdminTemplateController } from '~/controllers/admin-template.controller'
import { validationSchema } from '~/schema/validation-schema'

export const adminRouter = new Elysia({ prefix: '/backend' })
    .use(validationSchema)
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
        return await AdminTemplateController.getAdminTemplate()
    })
    .post('/', async ({ body }) => {
        return await AdminTemplateController.postAdminTemplate(body)
    }, {
        body: 'user.insert',
    })
