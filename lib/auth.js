// Makes users login to access certain routes by checking
// username in cookie.

const fs = require('fs');
const path = require("path");
const { promisify } = require('util')

const middleware = async (ctx, next) => {
  const readFile = promisify(fs.readFile);
  const data = await readFile(path.resolve(__dirname, '../.authorized'));
  if (ctx.session.email) {
    if (data.includes(ctx.session.email)) {
      await next()
      return
    }
  }
  ctx.redirect('/shorten/login');
}

module.exports = {
  middleware: () => middleware,
}
