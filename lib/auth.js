// Makes users login to access certain routes by checking
// username in cookie.
const middleware = async (ctx, next) => {
  if (ctx.session.username === process.env.USERNAME) {
    await next()
    return
  }
  ctx.redirect('/shorten/login')
}

module.exports = {
  middleware: () => middleware,
}
