import Metallic, { SERVER } from 'metallic'
import serve from 'koa-static'

const { app, role, start } = new Metallic({ port: 8888 })

if (role === SERVER) {
  app.use(serve('assets'))
}

start()
