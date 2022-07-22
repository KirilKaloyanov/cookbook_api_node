const mongoose = require('mongoose');
const config = require('config');
const express = require('express');
const users = require('./routes/users');

const app = express();

if (!config.get('jwtPrivateKey')) {
    console.error('Fatal Error: JWT Private Key is not defined');
    process.exit(1);
}

const db = config.get('db');

mongoose
    .connect(db)
    .then(() => console.log('Connected...'))
    .catch(err => console.log('Could not connect', err));


app.use(express.json());

app.use('/api/users', users);
    
app.listen(3001, ()=> console.log('Listening on port 3001')); 