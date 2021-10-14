const { Router } = require('express');
const ensureAuth = require('../middleware/ensureAuth');
const Comment = require('../models/Comment');

module.exports = Router()
    .post('/', ensureAuth, async (req, res, next) => {
        try {
            const newComment = await Comment.insert({
                ...req.body
            });
            res.json(newComment);
            //console.log('NEWgram', newComment);
        } catch (error) {
            next(error);
        }
    })

    .delete('/:id', ensureAuth, async (req, res, next) => {
        try {
            const id = req.params.id;
            const deleteIt = await Comment.deleteEntry(id);
            res.send(deleteIt);
        } catch (error) {
            next(error);
        }
    })
;
