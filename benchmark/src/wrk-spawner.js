import { spawn } from 'child_process'

export default class WrkSpawner {
  constructor (endpoint = 'http://localhost') {
    this.endpoint = endpoint
  }

  run (port) {
    return new Promise((resolve, reject) => {
      const args = [
        `${this.endpoint}:${port}`, 'admin1', '9', '136', '203', '18',
        '--latency', `-s ${__dirname}/bbox.lua`, '-d 5', '-c 10', '-t 4'
      ]

      const options = {
        shell: true
      }

      this.wrk = spawn('wrk', args, options)

      this.wrk.stdout.on('data', (results) => {
        this.results = results
      })

      this.wrk.on('close', code => code ? reject(code) : resolve(this.results))
      this.wrk.on('error', err => reject(err))
    })
  }

  stop () {
    return new Promise((resolve) => {
      this.wrk.kill()
      resolve()
    })
  }
}
