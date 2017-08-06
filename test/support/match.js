import fs from 'fs'
import assert from 'assert'
import path from 'path'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

export default async function match (fixtureName, body, threshold = 0.005) {
  const fixture = await getTileFixture(fixtureName)
  const tile = await getTile(body, fixtureName)
  const diff = new PNG({
    width: tile.width,
    height: tile.height
  })

  const numDiffPixels = pixelmatch(tile.data, fixture.data, diff.data, tile.width, tile.height, { threshold })

  await saveDiff(diff, fixtureName)
  await saveResult(tile, fixtureName)

  const similarity = numDiffPixels / (fixture.width * fixture.height)

  assert.ok(similarity < threshold, `Tile ${fixtureName} does not match: similarity(${similarity}) < threshold(${threshold})`)
}

function getTileFixture (fixtureName) {
  const fixturePath = path.join(process.cwd(), 'test/fixtures', `${fixtureName}.png`)

  return new Promise((resolve, reject) => {
    const fixture = fs.createReadStream(fixturePath)
      .pipe(new PNG())
      .on('parsed', () => resolve(fixture))
      .on('error', err => reject(err))
  })
}

function getTile (body, fixtureName) {
  return new Promise((resolve, reject) => {
    const tile = body.pipe(new PNG())
      .on('parsed', () => resolve(tile))
      .on('error', err => reject(err))
  })
}

function saveResult (tile, fixtureName) {
  const resultPath = path.join(process.cwd(), 'test/results', `${fixtureName}.png`)
  const resultStream = fs.createWriteStream(resultPath)

  return new Promise((resolve, reject) => {
    tile.pack()
      .pipe(resultStream)
      .on('error', err => reject(err))
      .on('close', () => resolve())
  })
}

function saveDiff (diff, fixtureName) {
  const diffPath = path.join(process.cwd(), 'test/results', `${fixtureName}-diff.png`)
  const diffStream = fs.createWriteStream(diffPath)

  return new Promise((resolve, reject) => {
    if (!diff.data) {
      return resolve()
    }

    diff.pack()
      .pipe(diffStream)
      .on('error', err => reject(err))
      .on('close', () => resolve())
  })
}
