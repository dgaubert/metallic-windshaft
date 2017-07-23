import { spawn } from 'child_process'

export default class AppSpawner {
  constructor (cluster = false) {
    this.cluster = cluster
  }

  run () {
    return new Promise((resolve, reject) => {
      const args = [`${__dirname}/app.js`]

      if (this.cluster) {
        args.push('--cluster')
      }
      this.app = spawn('node', args, {
        stdio: [ 'ignore', 'ignore', 'ignore', 'ipc' ]
      })

      this.app.on('error', err => reject(err))
      this.app.on('close', () => reject(new Error('close')))
      this.app.on('disconnect', () => reject(new Error('disconnect')))
      this.app.on('exit', () => reject(new Error('exit')))
      this.app.on('message', httpServersInfo => {
        for (let pid in httpServersInfo) {
          if (httpServersInfo.hasOwnProperty(pid)) {
            return resolve(httpServersInfo[pid].port)
          }
        }
        reject(new Error('App is not available'))
      })
    })
  }

  stop () {
    return new Promise(resolve => {
      this.app.kill()
      resolve()
    })
  }
}
