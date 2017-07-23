import meow from 'meow'
import AppSpawner from './app-spawner'
import WrkSpawner from './wrk-spawner'
import BenchPrinter from './bench-printer'

const help = `
  Usage:
    $ npm run benchmark [-- <options>]

  Options:
    -r, --release Save results in ./BENCHMARK.md (default: disable)

  Examples
    $ npm run benchmark -- -r
`
const options = {
  alias: {
    r: 'release',
    c: 'cluster'
  },
  boolean: [ // options that are always boolean
    'release',
    'cluster'
  ],
  default: {
    release: false
  }
}
const { cluster, release } = meow({ help }, options).flags
const appSpawner = new AppSpawner(cluster)
const wrkSpawner = new WrkSpawner()
const benchPrinter = new BenchPrinter(release)

async function run () {
  try {
    const port = await appSpawner.run()
    const results = await wrkSpawner.run(port)
    await benchPrinter.print(results)
    await appSpawner.stop()
    await wrkSpawner.stop()
  } catch (err) {
    console.error(err)
  }
}

run()
