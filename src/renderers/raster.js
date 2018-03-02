import path from 'path'
import mapnik, { Map, Image } from 'mapnik'
import { promisify } from 'util'

const TILE_SIZE = 256
const ALLOWED_ENCODINGS = {
  png: true
}

const EARTH_RADIUS = 6378137
const EARTH_DIAMETER = EARTH_RADIUS * 2
const EARTH_CIRCUMFERENCE = EARTH_DIAMETER * Math.PI
const MAX_RESOLUTION = EARTH_CIRCUMFERENCE / TILE_SIZE
const ORIGIN_SHIFT = EARTH_CIRCUMFERENCE / 2

const shapeDatasource = path.join(mapnik.settings.paths.input_plugins, 'shape.input')
mapnik.register_datasource(shapeDatasource)

export default class RasterRenderer {
  async _load ({ path, xml } = {}) {
    if ((path === undefined && xml === undefined) || (path !== undefined && xml !== undefined)) {
      throw new Error(`Bad arguments: either 'path' or 'xml' should be provided`)
    }

    if (path !== undefined && typeof path !== 'string') {
      throw new Error(`Bad argument: 'path' should be a string`)
    }

    if (xml !== undefined && typeof xml !== 'string') {
      throw new Error(`Bad argument: 'xml' should be a string`)
    }

    const map = new Map(TILE_SIZE, TILE_SIZE)

    let boundFn
    let args

    if (path !== undefined) {
      boundFn = map.load.bind(map)
      args = [ path ]
    }

    if (xml !== undefined) {
      boundFn = map.fromString.bind(map)
      args = [ xml ]
    }

    return promisify(boundFn)(...args)
  }

  async _render ({ map }) {
    const image = new Image(TILE_SIZE, TILE_SIZE)
    const boundRender = map.render.bind(map)

    return promisify(boundRender)(image)
  }

  async _encode ({ image, encoding }) {
    if (!ALLOWED_ENCODINGS[encoding]) {
      throw new TypeError(`Encoding '${encoding}' not allowed`)
    }

    const boundEncode = image.encode.bind(image)

    return promisify(boundEncode)(encoding)
  }

  _extent ({ z, x, y }) {
    const bbox = []
    const total = Math.pow(2, z)
    const resolution = MAX_RESOLUTION / total

    const minx = (x * TILE_SIZE) * resolution - ORIGIN_SHIFT
    const miny = -((y + 1) * TILE_SIZE) * resolution + ORIGIN_SHIFT
    const maxx = ((x + 1) * TILE_SIZE) * resolution - ORIGIN_SHIFT
    const maxy = -((y * TILE_SIZE) * resolution - ORIGIN_SHIFT)

    bbox.push(minx, miny, maxx, maxy)

    return bbox
  }

  async tile ({ path, xml, coords, format }) {
    const map = await this._load({ path, xml })
    map.extent = this._extent(coords)
    const image = await this._render({ map })
    const tile = await this._encode({ image, encoding: format })

    return tile
  }
}
