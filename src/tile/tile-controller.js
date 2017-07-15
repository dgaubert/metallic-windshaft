import { default as Router } from 'krater'

const CONTENT_TYPE = 'png'

export default class TileController extends Router {
  constructor (render) {
    super()
    this.render = render
  }

  get () {
    return async ctx => {
      ctx.assert(ctx.accepts(CONTENT_TYPE), 415)

      const { layer, coords, format } = ctx.params

      ctx.body = await this.render.tile({ layer, coords, format })
      ctx.type = CONTENT_TYPE
    }
  }
}
