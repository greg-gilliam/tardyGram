const pool = require('../utils/pool');

module.exports = class User {
  username;
  photoUrl;

  constructor(row) {
    this.username = row.github_username;
    this.photoUrl = row.github_avatar_url;
  }

  static async insert({ username, photoUrl }) {
    const { rows } = await pool.query(
      'INSERT INTO users (github_username, github_avatar_url) VALUES ($1, $2) RETURNING *',
      [username, photoUrl]
    );

    return new User(rows[0]);
  }
};
