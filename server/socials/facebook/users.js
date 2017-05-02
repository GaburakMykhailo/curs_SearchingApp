const config = require('../../app.config');
const express = require('express');
const fetch = require('node-fetch');
const querystring = require('querystring');

const app = express();

/// @query { @name, @count?, @from? }
app.get('/users', (req, res) => {
    const name = req.query.name || '';
    const from = req.query.from || 0;
    const count = req.query.count || 25;

    //todo improve performance
    fetch(`${config.facebook.apiPath}/search?` + querystring.stringify({
            type: 'user',
            q: name,
            format: 'json',
            access_token: req.session.facebook,
            limit: count,
            offset: from,
        }))
        .then((data) => data.json())
        .then((data) => res.json(data));
});

/// @query { @id }
app.get('/user-picture', (req, res) => {
    const id = req.query.id;

    fetch(`${config.facebook.apiPath}/${id}/picture?` + querystring.stringify({
            type: 'large',
            format: 'json',
            fields: 'url',
            redirect: false,
            access_token: req.session.facebook,
        }))
        .then((data) => data.json())
        .then((data) => {
            res.json(data)
        })
        .catch((error) => console.log(error));
});

module.exports = app;
