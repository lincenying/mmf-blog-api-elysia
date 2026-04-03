import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { config } from '~/config'
import * as schema from '../schema/postgre-sql'

const pool = new Pool({
    connectionString: config.db.postgre,
})

export const db = drizzle(pool, { schema })
