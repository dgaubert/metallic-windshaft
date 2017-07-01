import path from 'path'

const pathToMapsDir = path.join(process.cwd(), 'resources/maps')

const COUNTRIES = 'admin0'
const COUNTRIES_PATH = path.join(pathToMapsDir, 'style-admin0.xml')

const STATES = 'admin1'
const STATES_PATH = path.join(pathToMapsDir, 'style-admin1.xml')

const LAYERS = {}
LAYERS[COUNTRIES] = COUNTRIES_PATH
LAYERS[STATES] = STATES_PATH

export default class TileService {
  constructor ({ tileBackend }) {
    this.tileBackend = tileBackend
  }

  async render ({ layer, z, x, y }) {
    const path = this.pathToLayer({ layer })

    const map = await this.tileBackend.load({ path })
    map.extent = this.tileBackend.extent({ z, x, y })

    const image = await this.tileBackend.render({ map })
    const tile = await this.tileBackend.encode({ image })

    return tile
  }

  pathToLayer ({ layer }) {
    const pathToLayer = LAYERS[layer]

    if (!pathToLayer) {
      const err = new Error(`Missing layer ${layer}`)
      err.status = 400
      err.expose = true
      throw err
    }

    return pathToLayer
  }
}
