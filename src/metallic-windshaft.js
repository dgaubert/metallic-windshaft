import Metallic, { SERVER } from 'metallic'
import MapController from './map/map-controller'
import TileController from './tile/tile-controller'

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
      MapController.mount(app)
      TileController.mount(app)
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
