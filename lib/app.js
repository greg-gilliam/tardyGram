const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.static(`${__dirname}/../public`));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', require('./controllers/auth'));

app.use('/api/grams', require('./controllers/gram'));

app.use('/api/auth', require('./controllers/comment'));


app.use(require('./middleware/not-found.js'));
app.use(require('./middleware/error.js'));

module.exports = app;
