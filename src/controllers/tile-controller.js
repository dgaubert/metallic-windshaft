import BaseController from './base-controller'

const CONTENT_TYPE = 'png'
const REGEXP_PATH = '/:layer(\\w+)/:z(\\d+)/:x(\\d+)/:y(\\d+).:format'
const ALLOWED_METHODS = {
  'GET': true
}

export default class TileController extends BaseController {
  constructor ({ app, tileService }) {
    super({ pathRegexp: REGEXP_PATH })
    this.app = app
    this.tileService = tileService
  }

  regist () {
    this.app.use(async (ctx, next) => {
      if (!this.match(ctx.path)) {
        return next()
      }

      if (!ALLOWED_METHODS[ctx.method]) {
        ctx.throw(405)
      }

      if (!ctx.accepts(CONTENT_TYPE)) {
        ctx.throw(415)
      }

      ctx.params = this.params(ctx.path)
      ctx.body = await this.tileService.render(ctx.params)
      ctx.type = CONTENT_TYPE
    })
  }

  params (path) {
    let [ layer, z, x, y ] = super.params(path)

    z = parseInt(z, 10)
    x = parseInt(x, 10)
    y = parseInt(y, 10)

    const max = Math.pow(2, z)

    if (!Number.isFinite(max) || x < 0 || x >= max || y < 0 || y >= max) {
      const err = new Error(`Coordinates out of range (z/x/y: ${z}/${x}/${y})`)
      err.status = 400
      err.expose = false
      throw err
    }

    return { layer, z, x, y }
  }
}
