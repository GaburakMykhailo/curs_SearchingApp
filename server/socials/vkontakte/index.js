const express = require('express');

const app = express();

const login = require('./login');
app.use(login);

const autorized = require('./autorized');
app.use(autorized);

const users = require('./users');
autorized.use(users);

const feeds = require('./feeds');
autorized.use(feeds);

module.exports = app;
