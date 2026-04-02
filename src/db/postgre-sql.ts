import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../schema/postgre-sql'

const pool = new Pool({
    connectionString: 'postgresql://postgres:113511000@localhost:5432/mmfblog_v2',
})

export const db = drizzle(pool, { schema })
