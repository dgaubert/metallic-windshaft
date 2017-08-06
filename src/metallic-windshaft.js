import Metallic, { SERVER } from 'metallic'
import Cartonik from 'cartonik'
import RasterRenderer from './renders/raster'
import MapController from './map/map-controller'
import TileController from './tile/tile-controller'
import LayerValidator from './tile/layer-validator'
import CoordsValidator from './tile/coords-validator'
import FormatValidator from './tile/format-validator'

export default class MetallicWindshaft {
  constructor (port) {
    this.metallic = new Metallic({
      port,
      metrics: {
        enabled: false
      }
    })

    const { app, role } = this.metallic

    if (role === SERVER) {
      const mapController = new MapController()
      mapController
        .path('/')
        .regist(app)

      const cartonik = new Cartonik()
      const renderer = new RasterRenderer(cartonik)
      const tileController = new TileController(renderer)
      tileController
        .path('/:layer(\\w+)/:z(\\d+)/:x(\\d+)/:y(\\d+).:format')
        .hook([
          new LayerValidator().validate(),
          new CoordsValidator().validate(),
          new FormatValidator().validate()
        ])
        .regist(app)
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
