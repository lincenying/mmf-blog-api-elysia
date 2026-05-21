import mongoose from 'mongoose'

import { config } from '~/config'

const mongoUri = `${config.db.mongo_uri}/${config.db.mongo_db}`

mongoose.set('strictQuery', false)
mongoose.connect(mongoUri, {})
mongoose.Promise = globalThis.Promise

mongoose.connection.on('error', (err) => {
    console.error('mongoose连接出错', err)
})

export default mongoose
