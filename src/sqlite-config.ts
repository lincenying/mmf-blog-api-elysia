import Database from 'bun:sqlite'

const db: Database = new Database('./.data/db.sqlite3')

export default db
