const jwt = require('jsonwebtoken')
const { Bearer } = require('permit')
const User = require('../models/User')

const permit = new Bearer()

const middleware = async (ctx, next) => {
  const { req, res } = ctx
  const token = permit.check(req)
  if (token) {
    const payload = jwt.verify(token, process.env.SECRET)
    const user = await User.query()
      .where('id', payload.sub)
      .first()
    if (user) {
      ctx.state.user = user
      await next()
      return
    }
  }
  permit.fail(res)
  ctx.throw(403, 'Invalid token')
}

module.exports = {
  jwt: () => middleware,
}
