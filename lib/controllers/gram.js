const { Router } = require('express');
const ensureAuth = require('../middleware/ensureAuth');
const Gram = require('../models/Gram');

module.exports = Router()
    .post('/grams', ensureAuth, async (req, res, next) => {
        try {
            const newGram = await Gram.insert({
                ...req.body
            });
            res.json(newGram);
            //console.log('NEWgram', newGram);
        } catch (error) {
            next(error);
        }

    })
;

