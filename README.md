# metallic-windshaft

CARTO Engine code test: next generation of tile servers ;)

# Quickstart

Clone repository:
```bash
$ git clone https://github.com/dgaubert/metallic-windshaft.git
```

Installation:
```
$ npm i
```

Build:
```
$ npm run build
```

Run tile server:
```
$ npm start
```

Open http://localhost:8888 in your browser. Have fun.

# Requirements

- node.js 7.6 or higher
- npm 5 or higher

# Features

- Cluster mode by default, turn it off `npm start -- --no-cluster`
- Validates input params: layer, coordinates and format
- Calculates bounding box from `z/x/y` coordinates
- Application bundled with common middlewares:
  * Adds response time header `X-Response-Time`
  * Identifies every request with a unique identifier setting a custom header `X-Request-ID` and accesible via `ctx.state.requestId`
  * Proper error handling based on `content-type`
- Full logging, default file output: `./metallic-winshaft.log`. To change the log path: `npm start -- --log-path /tmp/tiler.log`. If NODE_ENV is not defined or `development` also uses `stdout` to log
  * Every request has assigned an `uuid` to correlate all activity in the req/res cycle
  * Use [Bunyan CLI](https://github.com/trentm/node-bunyan#cli-usage) for pretty-printting logs and for filtering
- Graceful suthdown, once all the ongoing requests are served the application will be terminated

# Notes

- This repository implements [CARTO Node.js code test](https://gist.github.com/rochoa/9a7a3f4c91e8ea20458f87b8861d0ba2) and is not intended for a general use
- This service depends on two modules to implement the requested features. See:
  * [metallic](https://github.com/cartodb/metallic)
  * [krater](https://github.com/dgaubert/krater)
- `metallic-windshat` is a proof of concept to show you how to use `metallic` and its goodies.
