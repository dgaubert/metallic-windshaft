import pathToRegexp from 'path-to-regexp'

export default class BaseController {
  constructor ({ pathRegexp }) {
    this.regexp = pathToRegexp(pathRegexp)
  }

  match (path) {
    return this.regexp.test(path)
  }

  params (path) {
    const [ , ...params ] = this.regexp.exec(path)
    return params
  }
}
