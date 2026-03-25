import { Elysia, t } from 'elysia'

import { UploadImageController } from '~/controllers/upload-image.controller'
import { responseWrapperMiddleware } from '~/middleware/response-wrapper'
import { createCorsConfig } from '~/plugins'
import { tt } from '~/schema/validation-schema-error'

export const uploadRouter = new Elysia({ prefix: '/api/upload' })
    .use(createCorsConfig())
    .use(responseWrapperMiddleware)
    .post('/image', async ({ body }) => {
        return UploadImageController.uploadImage(body.file)
    }, {
        body: t.Object({
            file: tt.File('文件', {
                type: 'image',
            }),
        }),
    })
