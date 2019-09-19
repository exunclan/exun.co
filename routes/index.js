const Router = require('koa-router')

const Shortlink = require('../models/Shortlink')
const auth = require('../lib/auth')
const normalizeUrl = require('../lib/normalizeUrl')

const router = new Router()

router.get('/shorten', auth.middleware(), async ctx => {
  await ctx.render('index')
})

router.post('/shorten', auth.middleware(), async ctx => {
  const { slug, target } = ctx.request.body
  const normalizedTarget = normalizeUrl(target)
  const shortlink = await Shortlink.query().findOne('slug', slug)
  if (shortlink) {
    if (normalizedTarget === '') {
      await Shortlink.query()
        .findOne('slug', slug)
        .delete()
    } else {
      await Shortlink.query()
        .findOne('slug', slug)
        .patch({ target: normalizedTarget })
    }
  } else if (!shortlink && normalizedTarget !== '') {
    await Shortlink.query().insert({
      slug,
      target: normalizedTarget,
    })
  }

  ctx.redirect('back')
})

router.get('/shorten/login', async ctx => {
  await ctx.render('login')
})

router.post('/shorten/login', async ctx => {
  const { username, password } = ctx.request.body
  if (username === process.env.USERNAME && password === process.env.PASSWORD) {
    ctx.session.username = username
    ctx.redirect('/shorten')
  } else await ctx.render('login', { error: 'Incorrect username or password' })
})

router.get('/shorten/logout', async ctx => {
  ctx.session = null
  ctx.redirect('/shorten/login')
})

/**
 * Redirect actual shortlinks.
 */
router.get('*', async ctx => {
  const { pathname } = ctx.URL
  if (pathname === '/') {
    ctx.redirect('https://exunclan.com')
    return
  }
  const shortlink = await Shortlink.query().findOne('slug', pathname.slice(1))
  if (!shortlink) {
    ctx.throw(404)
    return
  }
  ctx.redirect(shortlink.target)
})

module.exports = router
