const express = require('express');
const fetch = require('node-fetch');
const passport = require('../../passport');

const app = express();

let waitLoginRes = null;

app.get('/login', passport.authenticate('vkontakte'));

app.get('/waitlogin', (req, res) => {
    waitLoginRes = res;
});

app.get(
    '/callback',
    passport.authenticate('vkontakte', { failureRedirect: '/' }),
    (req, res) => {
        setTimeout(() => {
            req.session.vkontakte = req.user.vkontakte.accessToken;
            res.send('<script>window.close();</script>')

            if (waitLoginRes) {
                waitLoginRes.json({login: true, error: null});
            }
        })
    }
);

module.exports = app;
