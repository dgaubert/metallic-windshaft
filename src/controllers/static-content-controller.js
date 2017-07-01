import BaseController from './base-controller'

import { readFileSync as readFile } from 'fs'
import path from 'path'

const INDEX = 'index.html'
const PATH_TO_INDEX = path.join(process.cwd(), INDEX)
const INDEX_CONTENT = readFile(PATH_TO_INDEX, 'utf8')

const CONTENT_TYPE = 'html'
const REGEXP_PATH = '/'
const ALLOWED_METHODS = {
  'GET': true
}

export default class StaticContentController extends BaseController {
  constructor ({ app }) {
    super({ pathRegexp: REGEXP_PATH })
    this.app = app
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

      ctx.body = INDEX_CONTENT
      ctx.type = CONTENT_TYPE
    })
  }
}
