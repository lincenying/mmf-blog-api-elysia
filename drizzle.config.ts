import { defineConfig } from 'drizzle-kit'
import { config } from '~/config'

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/schema/postgre-sql.ts',
    out: './drizzle-postgre',
    dbCredentials: {
        url: `postgresql://${config.db.postgre_user}:${config.db.postgre_password}@${config.db.postgre_host}:${config.db.postgre_port}/${config.db.postgre_db}`,
    },
    verbose: true,
    strict: true,
})
