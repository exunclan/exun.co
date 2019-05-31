const { Model } = require('objection')

class Shortlink extends Model {
  static get tableName() {
    return 'shortlinks'
  }
}

module.exports = Shortlink
