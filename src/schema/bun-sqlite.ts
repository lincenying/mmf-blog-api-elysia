import type z from 'zod'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'

export const articles = sqliteTable('articles', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    content: text('content').notNull(),
    date: text('date').notNull(),
    author: text('author').notNull(),
    category: text('category').notNull(),
    views: integer('views').default(0).notNull(),
})

export const insertArticlesSchema = createInsertSchema(articles).omit({
    id: true,
    date: true,
    views: true,
})

export const modifyArticlesSchema = createUpdateSchema(articles)

export const selectArticlesSchema = createSelectSchema(articles)

export type Articles = typeof articles.$inferSelect
export type NewArticles = z.infer<typeof insertArticlesSchema>
export type ModifiedArticles = z.infer<typeof modifyArticlesSchema>
