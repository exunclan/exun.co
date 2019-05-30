const { Model } = require('objection')
const bcrypt = require('bcrypt')

class User extends Model {
  static get tableName() {
    return 'users'
  }

  async verify(password) {
    const isCorrect = await bcrypt.compare(password, this.password)
    return isCorrect
  }
}

module.exports = User
