const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const { Basic } = require('permit')

const User = require('../../models/User')

const router = new Router({
  prefix: '/auth',
})

const permit = new Basic()

router.post('/', async ctx => {
  const { req, res } = ctx
  // Get credentials from HTTP header
  const credentials = permit.check(req)
  if (credentials) {
    const [email, password] = credentials
    const user = await User.query()
      .where('email', email.trim().toLowerCase())
      .first()
    if (user && user.verify(password)) {
      // Issue token.
      const token = jwt.sign({}, process.env.SECRET, {
        subject: `${user.id}`,
      })
      ctx.body = {
        ok: true,
        token,
      }
      return
    }
  }
  permit.fail(res)
  ctx.throw(403, 'Incorrect email or password')
})

module.exports = router
