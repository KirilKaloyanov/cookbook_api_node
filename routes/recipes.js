const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
const { Category } = require('../models/category');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    const recipes = await Recipe.find().populate('userId', 'username -_id');
    res.send(recipes);
});

router.get('/:recipeId', async (req, res) => {
    const recipe = await Recipe.find( {_id: req.params.recipeId } ).populate('userId', 'username -_id');
    res.send(recipe);
})

router.get('/users/:userId', async (req, res) => {
    const recipes = await Recipe.find({userId: req.params.userId});
    res.send(recipes);
});

router.post('/', auth, async (req, res) => {
    let category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Invalid category");

    try {
        const recipe = new Recipe({
            name: req.body.name,
            numberOfServings: req.body.numberOfServings,
            imageUrl: req.body.imageUrl,
            ingredients: req.body.ingredients,
            method: req.body.method,
            category: {
                _id: category._id,
                name: category.name
            },
            userId: req.user._id
        })
        await recipe.save();
        res.send(recipe);
    } catch (ex) {
        res.status(400).send(ex);
    }
});

module.exports = router;