const express = require('express');
const fetch = require('node-fetch');
const passport = require('../../passport');

const app = express();

app.get('/login', passport.authenticate('vkontakte'));


app.get(
    '/callback',
    passport.authenticate('vkontakte', { failureRedirect: '/' }),
    (req, res) => {
        setTimeout(() => {
            req.session.vkontakte = req.user.vkontakte.accessToken;
            res.send('<script>window.close();</script>')
        })
    }
);

module.exports = app;
