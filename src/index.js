import Metallic, { SERVER } from 'metallic'

import StaticContentController from './controllers/static-content-controller'

import TileBackend from './backends/tile-backend'
import TileService from './services/tile-service'
import TileController from './controllers/tile-controller'

const { app, role, start } = new Metallic({
  port: 8888,
  metrics: {
    enabled: false
  }
})

if (role === SERVER) {
  const staticContentController = new StaticContentController({ app })
  staticContentController.regist()

  const tileBackend = new TileBackend()
  const tileService = new TileService({ tileBackend })
  const tileController = new TileController({ app, tileService })
  tileController.regist()
}

start()
