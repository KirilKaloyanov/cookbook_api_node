const mongoose = require('mongoose');
const config = require('config');

const db = config.get('db');

mongoose
    .connect(db)
    .then(() => console.log('Connected...'))
    .catch(err => console.log('Could not connect', err));

    