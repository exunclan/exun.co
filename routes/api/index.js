const Router = require('koa-router')

const router = new Router({
  prefix: '/api/v1',
})

router.get('/', ctx => {
  ctx.body = {
    ok: true,
    version: '1.0',
  }
})

router.use(require('./auth').routes())

module.exports = router
