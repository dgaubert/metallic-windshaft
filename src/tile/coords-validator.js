export default function coordsValidator () {
  return async function coordsValidatorMiddleware (ctx, next) {
    let { z, x, y } = ctx.params

    z = parseInt(z, 10)
    x = parseInt(x, 10)
    y = parseInt(y, 10)

    const max = Math.pow(2, z)
    const validCoordinates = (x >= 0 && x <= max) && (y >= 0 && y <= max)
    ctx.assert(validCoordinates, 400, `Coordinates out of range (z/x/y: ${z}/${x}/${y})`)

    ctx.params.coords = { z, x, y }

    await next()
  }
}
