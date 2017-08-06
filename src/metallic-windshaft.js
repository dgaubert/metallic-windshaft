import Metallic, { SERVER } from 'metallic'
import Cartonik from 'cartonik'
import RasterRenderer from './renders/raster'
import MapController from './map/map-controller'
import TileController from './tile/tile-controller'
import layerValidator from './tile/layer-validator'
import coordsValidator from './tile/coords-validator'
import formatValidator from './tile/format-validator'

export default class MetallicWindshaft {
  constructor (port) {
    this.metallic = new Metallic({
      port,
      metrics: {
        enabled: false
      }
    })

    if (this.metallic.role === SERVER) {
      const mapController = new MapController()
      mapController
        .path('/')
        .regist(this.metallic.app)

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
        .regist(this.metallic.app)
    }
  }

  async start () {
    const httpServerInfo = await this.metallic.start()
    return httpServerInfo
  }

  async stop () {
    await this.metallic.stop()
  }
}
