import path from 'path'

const pathToMapsDir = path.join(process.cwd(), 'resources/maps')

const COUNTRIES = 'admin0'
const COUNTRIES_PATH = path.join(pathToMapsDir, 'style-admin0.xml')

const STATES = 'admin1'
const STATES_PATH = path.join(pathToMapsDir, 'style-admin1.xml')

const LAYERS = {}
LAYERS[COUNTRIES] = COUNTRIES_PATH
LAYERS[STATES] = STATES_PATH

const SUPPORTED_FORMATS = {
  png: true
}

export default [
  async (ctx, next) => {
    const { layer } = ctx.params
    const layerPath = LAYERS[layer]

    ctx.assert(layerPath, 400, `Layer ${layer} does not exist`)

    ctx.params.layer = layerPath

    await next()
  },
  async (ctx, next) => {
    let { z, x, y } = ctx.params

    z = parseInt(z, 10)
    x = parseInt(x, 10)
    y = parseInt(y, 10)

    const max = Math.pow(2, z)
    const validCoordinates = (x >= 0 && x <= max) && (y >= 0 && y <= max)
    ctx.assert(validCoordinates, 400, `Coordinates out of range (z/x/y: ${z}/${x}/${y})`)

    ctx.params.coords = { z, x, y }

    await next()
  },
  async (ctx, next) => {
    const { format } = ctx.params

    ctx.assert(SUPPORTED_FORMATS[ctx.params.format], 422, `Unsupported format ${format}`)

    await next()
  }
]
