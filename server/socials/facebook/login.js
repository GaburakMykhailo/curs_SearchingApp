const express = require('express');
const fetch = require('node-fetch');
const passport = require('../../passport');

const app = express();

app.get('/login', passport.authenticate('facebook'));

app.get(
    '/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    (req, res) => {
        setTimeout(() => {
            req.session.facebook = req.user.facebook.accessToken;
            res.send('<script>window.close();</script>');
        })
    }
);

module.exports = app;
