const Router = require('koa-router')

const router = new Router()

router.use(require('./api').routes())

module.exports = router
