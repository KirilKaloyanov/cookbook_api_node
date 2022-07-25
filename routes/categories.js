const express = require('express');
const router = express.Router();
const { Category } = require('../models/category');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', async (req, res) => {
    const categories = await Category.find();
    res.send(categories);
})

router.post('/', [auth, admin], async (req, res) => {
    const category = new Category({
        name: req.body.name
    });
    await category.save();
    res.send(category);
})

module.exports = router;