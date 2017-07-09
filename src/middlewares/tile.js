import { default as Router } from 'krater'
import path from 'path'

const CONTENT_TYPE = 'png'
const SUPPORTED_FORMATS = {
  png: true
}

const pathToMapsDir = path.join(process.cwd(), 'resources/maps')

const COUNTRIES = 'admin0'
const COUNTRIES_PATH = path.join(pathToMapsDir, 'style-admin0.xml')

const STATES = 'admin1'
const STATES_PATH = path.join(pathToMapsDir, 'style-admin1.xml')

const LAYERS = {}
LAYERS[COUNTRIES] = COUNTRIES_PATH
LAYERS[STATES] = STATES_PATH

export default class TileMiddleware extends Router {
  constructor (cartonik) {
    super()
    this.cartonik = cartonik
  }

  params (ctx) {
    let [ layer, z, x, y, format ] = super.params(ctx)

    z = parseInt(z, 10)
    x = parseInt(x, 10)
    y = parseInt(y, 10)

    const max = Math.pow(2, z)

    if (!Number.isFinite(max) || x < 0 || x >= max || y < 0 || y >= max) {
      ctx.throw(400, `Coordinates out of range (z/x/y: ${z}/${x}/${y})`)
    }

    return { layer, z, x, y, format }
  }

  get () {
    return [
      async (ctx, next) => {
        ctx.assert(ctx.accepts(CONTENT_TYPE), 415)
        ctx.params = this.params(ctx)
        ctx.assert(SUPPORTED_FORMATS[ctx.params.format], 422, `Unsupported format ${ctx.params.format}`)

        await next()

        ctx.body = ctx.state.tile
        ctx.type = CONTENT_TYPE
      },
      async (ctx, next) => {
        const layerPath = LAYERS[ctx.params.layer]
        ctx.assert(layerPath, 400, `Layer ${ctx.params.layer} does not exist`)
        ctx.state.layerPath = layerPath

        await next()
      },
      async (ctx, next) => {
        const map = await this.cartonik.load({ path: ctx.state.layerPath })

        map.extent = this.cartonik.extent({ z: ctx.params.z, x: ctx.params.x, y: ctx.params.y })
        ctx.state.map = map

        await next()
      },
      async (ctx, next) => {
        const image = await this.cartonik.render({ map: ctx.state.map })

        ctx.state.image = image

        await next()
      },
      async (ctx, next) => {
        const tile = await this.cartonik.encode({ image: ctx.state.image })

        ctx.state.tile = tile

        await next()
      }
    ]
  }
}
