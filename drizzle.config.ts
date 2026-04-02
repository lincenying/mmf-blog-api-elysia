import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/schema/postgre-sql.ts',
    out: './drizzle',
    dbCredentials: {
        url: 'postgresql://postgres:113511000@localhost:5432/mmfblog_v2',
    },
    verbose: true,
    strict: true,
})
