const pool = require('../utils/pool');

module.exports = class Gram {
    id;
    username;
    photoUrl;
    caption;
    tags;

    constructor(row) {
        this.id = row.id;
        this.username = row.username;
        this.photoUrl = row.photo_url;
        this.caption = row.caption;
        this.tags = row.tags;
    }

    static async insert({ username, photoUrl, caption, tags }) {
        const { rows } = await pool.query(
            `INSERT INTO grams (username, photo_url, caption, tags)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [username, photoUrl, caption, tags]
        );
        //console.log('rooooows', rows);
        return new Gram(rows[0]);
    }
}