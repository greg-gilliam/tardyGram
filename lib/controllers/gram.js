const { Router } = require('express');
const ensureAuth = require('../middleware/ensureAuth');
const Gram = require('../models/Gram');

module.exports = Router()
    .post('/', ensureAuth, async (req, res, next) => {
        try {
            const newGram = await Gram.insert({
                ...req.body,
            });
            res.json(newGram);
            //console.log('NEWgram', newGram);
        } catch (error) {
            next(error);
        }
    })

    .get('/', async (req, res, next) => {
        try {
            const savedGrams = await Gram.getAllGrams();
            res.send(savedGrams);
        } catch (error) {
            next(error);
        }
    })

    .delete('/:id', async (req, res, next) => {
        try {
            const id = req.params.id;
            const deleteGram = await Gram.delete(id);
            res.send(deleteGram);
        } catch (error) {
            next(error);
        }
    })

    .get('/:id', async (req, res, next) => {
        try {
            const id = req.params.id;
            const getGramsById = await Gram.getGramsById(id);
            res.send(getGramsById);
        } catch (error) {
            next(error);
        }
    })

    .patch('/grams/:id', async (req, res, next) => {
        try {
            const updatedGram = await Gram.update(req.params.id, {
                ...req.body,
            });
            res.send(updatedGram);
        } catch (err) {
            next(err);
        }
    });
