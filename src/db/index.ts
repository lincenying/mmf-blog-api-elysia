/**
 * Drizzle 实例统一出口（规范：db/index.ts 初始化/导出）。
 * SQLite 用于开发，PostgreSQL 用于生产；按模块从对应子路径导入。
 */
export { db as sqliteDb } from './bun-sqlite'
export { db as postgreDb } from './postgre-sql'
