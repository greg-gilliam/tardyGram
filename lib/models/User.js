const pool = require('../utils/pool');
const jwt = require('jsonwebtoken');

module.exports = class User {
  username;
  photoUrl;

  constructor(row) {
    this.username = row.github_username;
    this.photoUrl = row.github_avatar_url;
  }

  static async insert({ username, photoUrl }) {
    const { rows } = await pool.query(
      `INSERT INTO users
        (github_username, github_avatar_url)
      VALUES ($1, $2)
      RETURNING *`,
      [username, photoUrl]
    );

    return new User(rows[0]);
  }

  static async findByUsername(username) {
    const { rows } = await pool.query(
      `SELECT *
      FROM users
      WHERE github_username = ($1)`,
      [username]
    );

    // const user = await User.findByUsername('doesnotexist')
    // if (!user) await User.insert({...})
    if (!rows[0]) return null;

    return new User(rows[0]);
  }

  authToken() {
    return jwt.sign(this.toJSON(), process.env.APP_SECRET, {
      expiresIn: '24h',
    });
  }

  toJSON() {
    return {
      username: this.username,
      photoUrl: this.photoUrl,
    };
  }
};
