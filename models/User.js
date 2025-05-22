const db = require('../db');

class User {
  static findByUsername(username, callback) {
    db.query('SELECT * FROM users WHERE username = ?', [username], callback);
  }

  static create(user, callback) {
    db.query('INSERT INTO users SET ?', user, callback);
  }
}

module.exports = User;