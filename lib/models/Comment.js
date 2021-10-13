const pool = require('../utils/pool');

module.exports = class Comment {
    id;
    commentBy;
    gram;
    comment;

    constructor(row) {
        this.id = row.id;
        this.commentBy = row.comment_by;
        this.gram = row.gram;
        this.comment = row.comment;
    }

    static async insert({ commentBy, gram, comment }) {
        const { rows } = await pool.query(
            `INSERT INTO comments (comment_by, gram, comment)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [commentBy, gram, comment]
        );
        //console.log('rooooows', rows);
        return new Comment(rows[0]);
    }
}