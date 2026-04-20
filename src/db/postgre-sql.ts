import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { config } from '~/config'
import * as schema from '../schema/postgre-sql'

const pool = new Pool({
    connectionString: `postgresql://${config.db.postgre_user}:${config.db.postgre_password}@${config.db.postgre_host}:${config.db.postgre_port}/${config.db.postgre_db}`,
})

export const db = drizzle(pool, { schema })
