const config = require('../../app.config');
const express = require('express');
const fetch = require('node-fetch');
const querystring = require('querystring');

const app = express();

/// @query { @name, @count?, @from?, @fields?  }
app.get('/users', (req, res) => {
    const name = req.query.name || '';
    const from = req.query.from || 0;
    const count = req.query.count || 25;
    const fields = req.query.fields || 'photo_200,screen_name';

    //todo improve performance
    fetch(`${config.vkontakte.apiPath}/users.search?` + querystring.stringify({
            q: name,
            offset: from,
            count,
            fields,
            access_token: req.session.vkontakte,
            v: config.vkontakte.apiVersion,
        })
    )
        .then((data) => data.json())
        .then((data) => res.json(data))
        .catch((error) => { console.log(error); res.status(401); });
});

module.exports = app;
