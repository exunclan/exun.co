const Router = require('koa-router')

const path = require('path')
const fs = require('fs')
const Shortlink = require('../models/Shortlink')
const auth = require('../lib/auth')
const normalizeUrl = require('../lib/normalizeUrl')
const GoogleController = require('../controllers/GoogleController')

const router = new Router()

/**
 * Serve main view
 */
router.get('/shorten', auth.middleware(), async ctx => {
  try {
    const links = await Shortlink.query()
    await ctx.render('index', {
      profile_pic: ctx.session.profile_pic,
      name: ctx.session.name,
      email: ctx.session.email,
      links,
    })
  } catch (e) {
    console.error(e)
  }
})

/**
 * Normalize target URLs and create shortlinks
 */
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

/**
 * Delete shortlink
 */
router.post('/delete/:id', auth.middleware(), async ctx => {
  await Shortlink.query()
    .findOne('id', ctx.params.id)
    .delete()
  ctx.redirect('back')
})

/**
 * Serve Login view
 */
router.get('/shorten/login', async ctx => {
  await ctx.render('login', { login_url: GoogleController.getLoginUrl() })
})

/**
 * Authenticate with Google
 */
router.get('/shorten/auth', async ctx => {
  const { code } = ctx.request.query
  const profile = await GoogleController.callbackHandlerAndGetProfile(code)
  const { picture, name, email } = profile
  const data = fs.readFileSync(path.resolve(__dirname, '../.authorized'))
  if (data.includes(email)) {
    ctx.session.email = email
    ctx.session.name = name
    ctx.session.profile_pic = picture
    ctx.redirect('/shorten')
  } else {
    ctx.redirect('/unauthorized')
  }
})

/**
 * Redirect for emails not in .authorized
 */
router.get('/unauthorized', async ctx => {
  await ctx.render('login', {
    error:
      "Sorry, your account isn't authorized. This incident will be reported.",
    login_url: GoogleController.getLoginUrl(),
  })
})

/**
 * Logout
 */
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
