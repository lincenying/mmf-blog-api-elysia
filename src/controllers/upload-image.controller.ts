import { randomUUID } from 'node:crypto'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { ApiError } from '~/middleware/response-wrapper'

export class UploadImageController {
    public static async uploadImage(file: File) {
        // 确保上传目录存在
        const UPLOAD_DIR = './uploads'
        await mkdir(UPLOAD_DIR, { recursive: true })

        try {
            // 检查是否真的上传了文件
            if (!file || !(file instanceof File)) {
                throw new ApiError(201, '未上传文件或字段名称无效')
            }

            // 生成安全的文件名（使用 UUID 保留原始扩展名）
            const ext = file.name.split('.').pop()
            const safeName = `${randomUUID()}${ext ? `.${ext}` : ''}`
            const filePath = join(UPLOAD_DIR, safeName)

            // 将文件保存到磁盘
            await Bun.write(filePath, file)

            // 返回成功信息
            return {
                filename: safeName,
                originalName: file.name,
                size: file.size,
                type: file.type,
            }
        }
        catch (error) {
            console.error('上传错误:', error)
            throw new ApiError(500, '服务器内部错误')
        }
    }
}
