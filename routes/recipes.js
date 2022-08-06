const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Recipe = require('../models/recipe');
const { Category } = require('../models/category');
const auth = require('../middleware/auth');
const { listIndexes } = require('../models/recipe');

router.get('/', async (req, res) => {
    const recipes = await Recipe.find().populate('userId', 'username -_id');
    res.send(recipes);
});

router.get('/:recipeId', async (req, res) => {
    try {
        const recipe = await Recipe.find({ _id: req.params.recipeId }).populate('userId', 'username -_id');
        res.send(recipe[0]);
    } catch (ex) {
        res.status(404).send({ message: 'Recipe not found', error: ex });
    }
})

router.get('/users/:userId', auth, async (req, res) => {
    const recipes = await Recipe.find({ userId: req.params.userId });
    if (recipes.length === 0) res.send({ message: 'No recipes created yet' });
    else res.send(recipes);
});

router.get('/users/:userId/:recipeId', auth, async (req, res) => {
    try {
        const recipe = await Recipe.find({ _id: req.params.recipeId }).populate('userId', 'username -_id');
        if (recipe[0].userId.username !== req.user.username)
            return res.status(403).send({ message: 'Access denied' });
        res.send(recipe[0]);
    } catch (ex) {
        res.status(404).send({ message: 'Recipe not found', error: ex });
    }
})

router.post('/', auth, async (req, res) => {
    let category = await Category.find({ name: req.body.category });
    if (category.length === 0) return res.status(400).send({ message: "Invalid category" });

    try {
        const recipe = new Recipe({
            name: req.body.name,
            numberOfServings: req.body.numberOfServings,
            imageUrl: req.body.imageUrl,
            ingredients: req.body.ingredients,
            methods: req.body.methods,
            category: {
                _id: category[0]._id,
                name: category[0].name
            },
            userId: req.user._id
        })
        await recipe.save();
        res.send(recipe);
    } catch (ex) {
        res.status(400).send(ex);
    }
});

router.put('/:recipeId', auth, async (req, res) => {
    let category = await Category.find({ name: req.body.category });
    if (category.length === 0) return res.status(400).send({ message: "Invalid category" });

    try {
        const recipe = await Recipe.findByIdAndUpdate(
            req.params.recipeId,
            {
                name: req.body.name,
                numberOfServings: req.body.numberOfServings,
                imageUrl: req.body.imageUrl,
                ingredients: req.body.ingredients,
                methods: req.body.methods,
                category: {
                    _id: category[0]._id,
                    name: category[0].name
                },
                userId: req.user._id
            },
            { new: true }
        );

        if (!recipe) res.status(404).send({ message: 'The recipe was not found.' });

        res.send(recipe);
    } catch (ex) {
        res.status(400).send(ex);
    }
});

router.put('/:recipeId/new_comment', auth, async (req, res) => {
    if (req.body.comment.length < 1) return res.status(400).send({ message: 'Cannot save empty comment' })
    try {
        let recipe = await Recipe.findOne({ _id: req.params.recipeId });
        const id = new mongoose.Types.ObjectId();
        const createdAt = id.getTimestamp();
        recipe.comments.push({
            _id: id,
            user: req.user.username,
            comment: req.body.comment,
            createdAt: createdAt
        });
        await recipe.save();
        res.send(recipe);

    } catch (ex) {
        res.status(400).send(ex);
    }
});

router.put('/:recipeId/like', auth, async (req, res) => {
    try {
        let recipe = await Recipe.findOne({ _id: req.params.recipeId }).populate('userId', 'username -_id');
        let index = recipe.likes.findIndex(rl => rl.user === req.user.username);
        if (index < 0) {
            const id = new mongoose.Types.ObjectId();
            recipe.likes.push({ _id: id, user: req.user.username, like: true });
        } else {
            let userLike = recipe.likes[index];
            recipe.likes = recipe.likes.filter(like => like !== userLike);
            userLike.like = !userLike.like;
            recipe.likes.push(userLike);
        }
        await recipe.save();
        res.send(recipe);
    } catch (ex) {
        res.status(400).send(ex);
    }
});

router.delete('/:recipeId', auth, async (req, res) => {
    try {
        let recipe = await Recipe.findById(req.params.recipeId).populate('userId', 'username');
        if (recipe.userId.username !== req.user.username)
            return res.status(403).send({ message: 'Access denied' });
        recipe = await Recipe.deleteOne({ _id: req.params.recipeId })
        res.send(recipe);
    } catch (ex) {
        res.status(404).send({ message: 'Recipe not found', error: ex });
    }
})

module.exports = router;