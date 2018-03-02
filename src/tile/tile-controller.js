import { default as Router } from 'krater'
import RasterRenderer from '../renderers/raster'
import layerValidator from './layer-validator'
import coordsValidator from './coords-validator'
import formatValidator from './format-validator'

const CONTENT_TYPE = 'png'

export default class TileController extends Router {
  static mount (app) {
    const renderer = new RasterRenderer()
    const tileController = new TileController(renderer)

    tileController.path('/:layer(\\w+)/:z(\\d+)/:x(\\d+)/:y(\\d+).:format')
      .hook([
        layerValidator(),
        coordsValidator(),
        formatValidator()
      ])
      .regist(app)
  }

  constructor (render) {
    super()
    this.render = render
  }

  get () {
    return async ctx => {
      ctx.assert(ctx.accepts(CONTENT_TYPE), 415)

      const { layer: path, coords, format } = ctx.params

      ctx.body = await this.render.tile({ path, coords, format })
      ctx.type = CONTENT_TYPE
    }
  }
}
