import Metallic, { SERVER } from 'metallic'
import Cartonik from 'cartonik'
import RasterRenderer from './renders/raster'
import MapController from './map/map-controller'
import TileController from './tile/tile-controller'
import layerValidator from './tile/layer-validator'
import coordsValidator from './tile/coords-validator'
import formatValidator from './tile/format-validator'

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
  const renderer = new RasterRenderer(cartonik)
  const tileController = new TileController(renderer)
  const validators = [
    layerValidator,
    coordsValidator,
    formatValidator
  ]
  tileController
    .path('/:layer(\\w+)/:z(\\d+)/:x(\\d+)/:y(\\d+).:format')
    .hook(validators)
    .regist(app)
}

start()
