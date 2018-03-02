import { default as Router } from 'krater'
import { readFileSync as readFile } from 'fs'
import path from 'path'

const INDEX = 'index.html'
const PATH_TO_INDEX = path.join(process.cwd(), INDEX)
const INDEX_CONTENT = readFile(PATH_TO_INDEX, 'utf8')

const CONTENT_TYPE = 'html'

export default class MapController extends Router {
  static mount (app) {
    const mapController = new MapController()
    mapController.path('/').regist(app)
  }

  get () {
    return async ctx => {
      ctx.assert(ctx.accepts(CONTENT_TYPE), 415)

      ctx.body = INDEX_CONTENT
      ctx.type = CONTENT_TYPE
    }
  }
}
