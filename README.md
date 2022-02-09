# Exun’s Link Shortener
> Not using anymore. Moved to https://github.com/someshkar/dotco

> Used to run at [exun.co](https://exun.co/shorten).

## Setup

1. Create a file called `.env` with the following parameters:

```
PORT=3000
SECRET=<secret for signing cookies>
NODE_ENV=<'development' or 'production'>
```
2. Get the Google Cloud Credentials from [Ananay](https://ananayarora.com), name the file as 'client_secret.json' and put it in the root directory of this project (in the same folder as package.json, app.js, etc.)
3. Create a file called `.authorized` with the emails of those who are allowed to make shortlinks. Put each email in a new line.
4. Run `yarn` to install dependencies
5. Create a SQLite database with `sqlite3 db/<env>.sqlite3 < db/setup.sql` where `env` is either `development` or `production`
6. `yarn start` to launch 🚀


## Credits

Written by [Kabir Goel](https://kabirgoel.com/) and [Ananay Arora](https://ananayarora.com).
