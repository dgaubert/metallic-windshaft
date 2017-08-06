import assert from 'assert'
import fetch from 'node-fetch'
import match from '../support/match'
import MetallicWindshaft from '../../src/metallic-windshaft'

describe('metallic-windshaft', function () {
  beforeEach(async function () {
    this.server = new MetallicWindshaft(0)
    const httpServerInfo = await this.server.start()
    this.port = httpServerInfo[process.pid].port
  })

  afterEach(async function () {
    await this.server.stop()
  })

  it('GET / should return 200 OK with index.html', async function () {
    const res = await fetch(`http://localhost:${this.port}`)

    assert.ok(res.ok)
    assert.equal(res.status, 200)
    assert.equal(res.headers.get('content-type'), 'text/html; charset=utf-8')
  })

  it('GET /admin0/0/0/0.png should return 200 OK with image', async function () {
    const res = await fetch(`http://localhost:${this.port}/admin0/0/0/0.png`)

    assert.ok(res.ok)
    assert.equal(res.status, 200)
    assert.equal(res.headers.get('content-type'), 'image/png')
    assert.ok(res.headers.get('content-length') > 0)

    const tile = res.body

    await match('admin0-0-0-0', tile, 0.05)
  })

  it('GET /wadus/0/0/0.png should return 400 bad request', async function () {
    const res = await fetch(`http://localhost:${this.port}/wadus/0/0/0.png`)
    const body = await res.text()

    assert.ok(!res.ok)
    assert.equal(res.status, 400)
    assert.equal(res.headers.get('content-type'), 'text/plain; charset=utf-8')
    assert.equal(body, 'Layer wadus does not exist')
  })

  it('GET /admin0/wadus/0/0.png should return 404 not found', async function () {
    const res = await fetch(`http://localhost:${this.port}/admin0/wadus/0/0.png`)
    const body = await res.text()

    assert.ok(!res.ok)
    assert.equal(res.status, 404)
    assert.equal(res.headers.get('content-type'), 'text/plain; charset=utf-8')
    assert.equal(body, 'Not Found')
  })

  it('GET /admin0/0/wadus/0.png should return 404 not found', async function () {
    const res = await fetch(`http://localhost:${this.port}/admin0/0/wadus/0.png`)
    const body = await res.text()

    assert.ok(!res.ok)
    assert.equal(res.status, 404)
    assert.equal(res.headers.get('content-type'), 'text/plain; charset=utf-8')
    assert.equal(body, 'Not Found')
  })

  it('GET /admin0/0/0/wadus.png should return 404 not Found', async function () {
    const res = await fetch(`http://localhost:${this.port}/admin0/0/0/wadus.png`)
    const body = await res.text()

    assert.ok(!res.ok)
    assert.equal(res.status, 404)
    assert.equal(res.headers.get('content-type'), 'text/plain; charset=utf-8')
    assert.equal(body, 'Not Found')
  })

  it('GET /admin0/0/0/2.png should return 400 bad request', async function () {
    const res = await fetch(`http://localhost:${this.port}/admin0/0/0/2.png`)
    const body = await res.text()

    assert.ok(!res.ok)
    assert.equal(res.status, 400)
    assert.equal(res.headers.get('content-type'), 'text/plain; charset=utf-8')
    assert.equal(body, 'Coordinates out of range (z/x/y: 0/0/2)')
  })

  it('GET /admin0/0/0/0.wadus should return 422 bad request', async function () {
    const res = await fetch(`http://localhost:${this.port}/admin0/0/0/0.wadus`)
    const body = await res.text()

    assert.ok(!res.ok)
    assert.equal(res.status, 422)
    assert.equal(res.headers.get('content-type'), 'text/plain; charset=utf-8')
    assert.equal(body, 'Unsupported format wadus')
  })
})
