import { randomUUID } from 'node:crypto'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

export class UploadImageController {
    public static async uploadImage(file: File) {
        // 确保上传目录存在
        const UPLOAD_DIR = './uploads'
        await mkdir(UPLOAD_DIR, { recursive: true })

        try {
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
    }
}
