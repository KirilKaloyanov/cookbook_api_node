const mongoose = require('mongoose');
const { categorySchema } = require('./category');

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    numberOfServings: { type: Number, required: true },
    imageUrl: String,
    ingredients: {
        type: Array,
        validate: {
            validator: function (arr) { return arr && arr.length > 0 },
            message: 'A recipe needs at least 1 ingredient.'
        }
    },
    methods: {
        type: Array,
        validate: {
            validator: function (arr) { return arr && arr.length > 0 },
            message: 'A recipe needs at least 1 step for preparation.'
        }
    },
    category: categorySchema,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: Array,
    likes: Array
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;