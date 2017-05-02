const express = require('express');
const fetch = require('node-fetch');
const passport = require('../../passport');

const app = express();

let waitLoginRes = null;

app.get('/login', passport.authenticate('facebook'));

app.get('/waitlogin', (req, res) => {
    waitLoginRes = res;
});

app.get(
    '/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    (req, res) => {
        setTimeout(() => {
            req.session.facebook = req.user.facebook.accessToken;
            res.send('<script>window.close();</script>');

            if (waitLoginRes) {
                waitLoginRes.json({login: true, error: null});
            }
        })
    }
);

module.exports = app;
