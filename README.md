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
2. Get the Google Cloud Credentials from [Ananay](https://ananayarora.com).
3. Create a file called `.authorized` with the emails of those who are allowed to make shortlinks. Put each email in a new line.
4. Run `yarn` to install dependencies
5. Create a SQLite database with `sqlite3 db/<env>.sqlite3 < db/setup.sql` where `env` is either `development` or `production`
6. `yarn start` to launch 🚀


## Credits

Written by [Kabir Goel](https://kabirgoel.com/) and [Ananay Arora](https://ananayarora.com).
