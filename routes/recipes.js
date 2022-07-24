const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    const recipes = await Recipe.find().populate('userId', 'username');
    res.send(recipes);
})

router.get('/:userId', async (req, res) => {
    const recipes = await Recipe.find({userId: req.params.userId});
    res.send(recipes);
})

router.post('/', auth, async (req, res) => {
    try {
        const recipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            ingredients: req.body.ingredients,
            method: req.body.method,
            userId: req.user._id
        })
        await recipe.save();
        res.send(recipe);
    } catch (ex) {
        res.status(400).send(ex);
    }
});

module.exports = router;