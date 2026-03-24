import { Elysia, t } from 'elysia'
import { createCorsConfig } from '@/plugins'
import { UploadImageController } from '~/controllers/upload-image.controller'
import { responseWrapperMiddleware } from '~/middleware/response-wrapper'

export const uploadRouter = new Elysia({ prefix: '/api/upload' })
    .use(createCorsConfig())
    .use(responseWrapperMiddleware)
    .post('/image', async ({ body }) => {
        return UploadImageController.uploadImage(body.file)
    }, {
        body: t.Object({
            file: t.File({
                type: 'image',
                error: '请选择文件',
            }),
        }),
    })
