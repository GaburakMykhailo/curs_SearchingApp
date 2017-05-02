const express = require('express');

const app = express();

app.all('/**/', (req, res, next) => {
    if (!req.session.vkontakte) { res.sendStatus(401); return; }

    next();
});

module.exports = app;
