const http = require('http')
const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const serve = require('koa-static')
const logger = require('koa-logger')
const Sentry = require('@sentry/node')
const { Model } = require('objection')
const Knex = require('knex')
const router = require('./routes')
const knexfile = require('./knexfile')

const env = process.env.NODE_ENV || 'development'
const knex = Knex(knexfile[env])

Model.knex(knex)

const app = new Koa()
app.keys = [process.env.SECRET]

if (env === 'development') {
  app.use(logger())
} else if (env === 'production') {
  Sentry.init({
    dsn: 'https://_@sentry.io/_', // TODO: replace with URL provided by Sentry
  })
}
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = {
      ok: false,
      message: err.message,
    }
  }
})
app.use(bodyparser())
app.use(serve('public'))
app.use(router.routes())

const server = http.createServer(app.callback())
module.exports = server
