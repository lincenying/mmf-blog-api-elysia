import { Elysia, t } from 'elysia'
import { responseWrapperMiddleware } from '~/middleware/response-wrapper'
import { createCorsConfig } from '~/plugins'
import { validationSchema } from '~/schema/validation-schema'

export const wsRouter = new Elysia()
    .use(createCorsConfig())
    .use(validationSchema)
    .use(responseWrapperMiddleware)
    .guard({ cookie: 'cookies' })
    .ws('/chat', {
        open(ws) {
            const { room, name } = ws.data.query

            ws.subscribe(room)
            ws.publish(room, {
                message: `${name} has enter the room`,
                name: 'notice',
                time: Date.now(),
            })
        },
        message(ws, message) {
            const { room, name } = ws.data.query

            ws.publish(room, {
                message,
                name,
                time: Date.now(),
            })
        },
        close(ws) {
            const { room, name } = ws.data.query

            ws.publish(room, {
                message: `${name} has leave the room`,
                name: 'notice',
                time: Date.now(),
            })
        },
        body: t.String(),
        query: t.Object({
            room: t.String(),
            name: t.String(),
        }),
        response: t.Object({
            message: t.String(),
            name: t.String(),
            time: t.Number(),
        }),
    })
