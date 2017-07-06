import Metallic, { SERVER } from 'metallic'

import Cartonik from './cartonik'
import MapMiddleware from './middlewares/map'
import TileMiddleware from './middlewares/tile'

const { app, role, start } = new Metallic({
  port: 8888,
  metrics: {
    enabled: false
  }
})

if (role === SERVER) {
  const map = new MapMiddleware()
  map.path('/')
    .regist(app)

  const cartonik = new Cartonik()
  const tile = new TileMiddleware(cartonik)
  tile.path('/:layer(\\w+)/:z(\\d+)/:x(\\d+)/:y(\\d+).:format')
    .regist(app)
}

start()
