# Exun’s Link Shortener

Running at [exun.co](https://exun.co/shorten).

## Setup

1. Create a file called `.env` with the following parameters:

```
PORT=3000
SECRET=<secret for signing cookies>
NODE_ENV=<'development' or 'production'>
USERNAME=<login username>
PASSWORD=<login password>
```

2. Run `yarn` to install dependencies
3. Create a SQLite database with `sqlite3 db/<env>.sqlite3 < db/setup.sql` where `env` is either `development` or `production`
4. `yarn start` to launch 🚀

## Credits

Written by Kabir Goel.
