import type { z } from 'zod'
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { v4 as uuidv4 } from 'uuid'

export const users = pgTable('users', {
    // 主键：类似 MongoDB ObjectId 的字符串（24 位十六进制）
    _id: text('_id').primaryKey().default(uuidv4()),
    // 创建日期（格式：YYYY-MM-DD HH:MM:SS）
    creat_date: timestamp('creat_date', { mode: 'string' }),
    // 邮箱地址
    email: text('email').notNull().unique(),
    // 软删除标记（JSON 中为 '1'，建议使用 integer 或 boolean）
    is_delete: integer('is_delete').default(0), // 0=未删除，1=已删除
    // 密码（MD5 哈希值）
    password: text('password').notNull(),
    // Unix 时间戳（例如：1481119950）
    timestamp: integer('timestamp'),
    // 最后更新时间（格式：YYYY-MM-DD HH:MM:SS）
    update_date: timestamp('update_date', { mode: 'string' }),
    // 用户名
    username: text('username').notNull(),
})

export const insertUserSchema = createInsertSchema(users).omit({
    _id: true,
    creat_date: true,
    timestamp: true,
    update_date: true,
    is_delete: true,
})

export const selectUserSchema = createSelectSchema(users)

export type User = typeof users.$inferSelect
export type NewUser = z.infer<typeof insertUserSchema>
