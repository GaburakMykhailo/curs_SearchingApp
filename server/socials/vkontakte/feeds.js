const config = require('../../app.config');
const express = require('express');
const fetch = require('node-fetch');
const querystring = require('querystring');

const app = express();

/// @query { @name, @count?, @from?, @fields?  }
app.get('/feeds', (req, res) => {
    const name = req.query.name || '';
    const from = parseInt(req.query.from, 10) || 0;
    const count = parseInt(req.query.count, 10)  || 25;
    const fields = req.query.fields || '';

    //todo improve performance
    fetch(`${config.vkontakte.apiPath}/newsfeed.search?` + querystring.stringify({
            q: name,
            // offset: from,
            count: count + from,
            // fields,
            extended: 1,
            access_token: req.session.vkontakte,
            v: config.vkontakte.apiVersion,
        }))
        .then((data) => data.json())
        .then((data) => {
            try {
                data.response.items = data.response.items.slice(from);
            } catch (e) {
                console.log(e);
            }
            res.json(data)
        })
        .catch((error) => { console.log(error); res.status(401); });
});

module.exports = app;
