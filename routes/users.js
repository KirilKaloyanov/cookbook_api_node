const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/', async (req, res) => {
    let user = await User.findOne({ username: req.body.username })

    if (user) return res.status(400).send({
        errors: { usernameRegistered: 'Username is already registered' }
    });
    else
        try {
            user = new User({
                username: req.body.username,
                password: req.body.password,
                isAdmin: req.body.isAdmin,
            });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            await user.save();

            const token = user.generateAuthToken();

            res
                .header('x-auth-token', token)
                .send(user._id);
        } catch (ex) {
            res.status(400).send(ex);
        }

});

module.exports = router;
