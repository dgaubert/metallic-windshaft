import Router from '../router'
import { readFileSync as readFile } from 'fs'
import path from 'path'

const INDEX = 'index.html'
const PATH_TO_INDEX = path.join(process.cwd(), INDEX)
const INDEX_CONTENT = readFile(PATH_TO_INDEX, 'utf8')

const CONTENT_TYPE = 'html'

export default class MapMiddleware extends Router {
  get () {
    return async ctx => {
      ctx.assert(ctx.accepts(CONTENT_TYPE), 415)

      ctx.body = INDEX_CONTENT
      ctx.type = CONTENT_TYPE
    }
  }
}
