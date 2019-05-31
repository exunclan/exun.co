module.exports = {
  test: {
    client: 'sqlite3',
    connection: {
      filename: './db/test.sqlite3',
    },
    useNullAsDefault: true,
  },

  development: {
    client: 'sqlite3',
    connection: {
      filename: './db/development.sqlite3',
    },
    useNullAsDefault: true,
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: './db/production.sqlite3',
    },
    useNullAsDefault: true,
  },
}
