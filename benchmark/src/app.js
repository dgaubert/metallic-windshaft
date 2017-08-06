import MetallicWindshaft from '../../lib/metallic-windshaft'

async function run () {
  const tiler = new MetallicWindshaft(0)

  try {
    const httpServersInfo = await tiler.start()

    if (typeof process.send === 'function') {
      process.send(httpServersInfo)
    }
  } catch (err) {
    tiler.metallic.logger.error(err)
  }
}

run()
