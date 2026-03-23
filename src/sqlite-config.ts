import Database from 'bun:sqlite'

const db = new Database('./.data/db.sqlite3')

db.query(`CREATE TABLE IF NOT EXISTS "article" (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    date TEXT,
    author TEXT,
    category TEXT,
    views INTEGER NOT NULL
)`).run()

db.query('CREATE UNIQUE INDEX IF NOT EXISTS article_id_IDX ON "article" (id)').run()

export default db
