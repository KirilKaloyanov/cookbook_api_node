const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, minlength: 5, maxlength: 96},
    password: {type: String, required: true, minlength: 5, maxlength: 1024},
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id}, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

module.exports = User;