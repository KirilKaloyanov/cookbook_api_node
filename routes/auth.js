const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.post('/', async (req, res) => {
    let user = await User.findOne({ username: req.body.username});
    if (!user) return res.status(400).send({message: 'Invalid username or password'});

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) return res.status(400).send({message: 'Invalid username or password'});

    const token = user.generateAuthToken();
    res.send({token: token});
})

module.exports = router;