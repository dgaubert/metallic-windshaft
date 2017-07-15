import Metallic, { SERVER } from 'metallic'
import Cartonik from 'cartonik'
import Raster from './renders/raster'
import MapController from './map/map-controller'
import TileController from './tile/tile-controller'
import tileHooks from './tile/tile-hooks'

const { app, role, start } = new Metallic({
  port: 8888,
  metrics: {
    enabled: false
  }
})

if (role === SERVER) {
  const mapController = new MapController()
  mapController
    .path('/')
    .regist(app)

  const cartonik = new Cartonik()
  const render = new Raster(cartonik)
  const tileController = new TileController(render)
  tileController
    .path('/:layer(\\w+)/:z(\\d+)/:x(\\d+)/:y(\\d+).:format')
    .hook(tileHooks)
    .regist(app)
}

start()
