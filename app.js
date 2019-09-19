const http = require('http')
const path = require('path')
const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const serve = require('koa-static')
const logger = require('koa-logger')
const { Model } = require('objection')
const session = require('koa-session')
const Knex = require('knex')
const views = require('koa-views')
const Sentry = require('@sentry/node')
const router = require('./routes')
const knexfile = require('./knexfile')

const env = process.env.NODE_ENV || 'development'
const knex = Knex(knexfile[env])

Model.knex(knex)

const app = new Koa()
app.keys = [process.env.SECRET]

// Set up Sentry.
Sentry.init({ dsn: process.env.SENTRY_DSN })
if (env === 'development') {
  app.use(logger())
}
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    Sentry.captureException(err)
  }
})
app.use(bodyparser())
app.use(
  views(path.join(__dirname, 'views'), {
    map: {
      html: 'handlebars',
    },
  })
)
app.use(session(app))
app.use(serve('public'))
app.use(router.routes())

const server = http.createServer(app.callback())
module.exports = server
