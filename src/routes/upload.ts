import { randomUUID } from 'node:crypto'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { Elysia, t } from 'elysia'
import { createCorsConfig } from '@/plugins'
import { responseWrapperMiddleware } from '~/middleware/response-wrapper'

export const uploadRouter = new Elysia({ prefix: '/api/upload' })
    .use(createCorsConfig())
    .use(responseWrapperMiddleware)
    .post('/image', async ({ body }) => {
        // 确保上传目录存在
        const UPLOAD_DIR = './uploads'
        await mkdir(UPLOAD_DIR, { recursive: true })

        try {
            // 假设表单字段名为 "file"
            const file = body.file

            // 检查是否真的上传了文件
            if (!file || !(file instanceof File)) {
                return { code: 201, message: 'No file uploaded or invalid field name' }
            }

            // 生成安全的文件名（使用 UUID 保留原始扩展名）
            const ext = file.name.split('.').pop()
            const safeName = `${randomUUID()}${ext ? `.${ext}` : ''}`
            const filePath = join(UPLOAD_DIR, safeName)

            // 将文件保存到磁盘
            await Bun.write(filePath, file)

            // 返回成功信息
            return {
                code: 200,
                success: true,
                message: 'File uploaded successfully',
                data: {
                    filename: safeName,
                    originalName: file.name,
                    size: file.size,
                    type: file.type,
                },
            }
        }
        catch (error) {
            console.error('Upload error:', error)
            return { code: 500, message: 'Internal server error' }
        }
    }, {
        body: t.Object({
            file: t.File({
                type: 'image',
                error: '请选择文件',
            }),
        }),
    })
