import path from 'path'

const pathToMapsDir = path.join(process.cwd(), 'resources/maps')

const COUNTRIES = 'admin0'
const COUNTRIES_PATH = path.join(pathToMapsDir, 'style-admin0.xml')

const STATES = 'admin1'
const STATES_PATH = path.join(pathToMapsDir, 'style-admin1.xml')

const LAYERS = {}
LAYERS[COUNTRIES] = COUNTRIES_PATH
LAYERS[STATES] = STATES_PATH

export default async function layerValidator (ctx, next) {
  const { layer } = ctx.params
  const layerPath = LAYERS[layer]

  ctx.assert(layerPath, 400, `Layer ${layer} does not exist`)

  ctx.params.layer = layerPath

  await next()
}
