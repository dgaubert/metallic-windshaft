const SUPPORTED_FORMATS = {
  png: true
}

export default function formatValidator () {
  return async function formatValidatorMiddleware (ctx, next) {
    const { format } = ctx.params

    ctx.assert(SUPPORTED_FORMATS[ctx.params.format], 422, `Unsupported format ${format}`)

    await next()
  }
}
