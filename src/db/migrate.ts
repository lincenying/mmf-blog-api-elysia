import { migrate as migratePg } from 'drizzle-orm/postgres-js/migrator'
import { db } from './postgre-sql'

(async () => {
    await migratePg(db as never, { migrationsFolder: './drizzle-postgre' })
})()

console.log('Migrations applied.')
