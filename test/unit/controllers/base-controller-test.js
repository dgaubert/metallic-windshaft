import assert from 'assert'
import BaseController from '../../../src/controllers/base-controller'

describe('base controller', function () {
  it('should match "/" path', function () {
    const pathRegexp = '/'
    const baseController = new BaseController({ pathRegexp })

    assert.ok(baseController.match('/'))
  })

  it('should NOT match "/wadus" path', function () {
    const pathRegexp = '/'
    const baseController = new BaseController({ pathRegexp })

    assert.ok(!baseController.match('/wadus'))
  })

  it('should match "/layer" path', function () {
    const pathRegexp = '/:layer'
    const baseController = new BaseController({ pathRegexp })

    assert.ok(baseController.match('/layer'))
  })

  it('should NOT match "/" path', function () {
    const pathRegexp = '/:layer'
    const baseController = new BaseController({ pathRegexp })

    assert.ok(!baseController.match('/'))
  })

  it('should match "/layer/0" path', function () {
    const pathRegexp = '/:layer/:zoom(\\d+)'
    const baseController = new BaseController({ pathRegexp })

    assert.ok(baseController.match('/layer/0'))
  })

  it('should NOT match "/layer/wadus" path', function () {
    const pathRegexp = '/:layer/:zoom(\\d+)'
    const baseController = new BaseController({ pathRegexp })

    assert.ok(!baseController.match('/layer/wadus'))
  })
})
