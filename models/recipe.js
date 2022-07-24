const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    imageUrl: String,
    ingredients: {
        type: Array, 
        validate: {
            validator: function(arr) { return arr && arr.length > 0 },
            message: 'A recipe needs at least 1 ingredient.'
        }
    },
    method: {
        type: Array, 
        validate: {
            validator: function(arr) { return arr && arr.length > 0 },
            message: 'A recipe needs at least 1 step for preparation.'
        }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;