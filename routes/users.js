const express = require('express');
const User = require('../models/user');
const router = express.Router();

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
            user = await user.save();

            const token = user.generateAuthToken();

            res
                .header('x-auth-token', token)
                .send(user._id);
        } catch (ex) {
            res.status(400).send(ex);
        }

});

module.exports = router;
