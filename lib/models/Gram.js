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
        //console.log('HERE', username, photoUrl, caption, tags);
        const { rows } = await pool.query(
            `INSERT INTO grams (username, photo_url, caption, tags)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [username, photoUrl, caption, tags]
        );
        //console.log('rooooows', rows);
        return new Gram(rows[0]);
    }

    static async getAllGrams() {
        const { rows } = await pool.query(
            `SELECT *
            FROM grams`
        );
        return rows.map((row) => new Gram(row));
    }

    static async delete(id) {
        const { rows } = await pool.query(
            `DELETE FROM grams
            WHERE id = ($1)
            RETURNING *`,
            [id]
        );
        return rows[0];
    }

    static async getGramsById(id) {
        const { rows } = await pool.query(
            `SELECT
                grams.id,
                grams.username,
                grams.photo_url,
                grams.caption,
                grams.tags,
                users.github_username
            FROM grams
            INNER JOIN users
            ON grams.username = users.github_username
            INNER JOIN comments
            ON users.github_username = comments.comment_by
            WHERE users.github_username = ($1)`,
            [id]
        );
        console.log('JKJKJKKJJK', rows);
        return {
            id: rows[0].id,
            username: rows[0].username,
            photoUrl: rows[0].photo_url,
            caption: rows[0].caption,
            tags: rows[0].tags,
        };
    }

    static async update(id, { username, caption }) {
        const { rows } = await pool.query(
            `UPDATE grams 
                SET caption=$1 
                WHERE username=$2 
                AND id=$3 RETURNING *`,
            [caption, username, id]
        );
        return new Gram(rows[0]);
        //     comment: commentsRows.comment,
        // };
        // console.log(grams.rows);
        // const gramsRows = grams.rows[0];
        // const comments = await pool.query(
        //     `SELECT comments.comment
        //     FROM comments
        //     INNER JOIN users
        //     ON comments.comment_by = users.github_username
        //     WHERE users.github_username = ($1)`,
        //     [id]
        // );
        // const commentsRows = comments.rows;
    }

    static async getMostPopular() {
        const { rows } = await pool.query(
            `SELECT grams.caption, grams.photo_url, grams.username, 
            COUNT(comments.comment) as count 
            FROM grams 
            INNER JOIN comments 
            ON grams.id = comments.gram 
            GROUP BY grams.id 
            ORDER BY count DESC 
            LIMIT 10`
            );
            console.log('rooooows', rows);
        return rows.map((row) => new Gram(row));
    }

    static async update(id, { username, caption }) {
        const { rows } = await pool.query(
            `UPDATE grams SET caption=$1 WHERE username=$2 AND id=$3 RETURNING *`,
            [caption, username, id]
        );
        return new Gram(rows[0]);
    }
};

