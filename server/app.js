const config = require('./app.config');
const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const passport = require('./passport');

const staticFiles = path.resolve(__dirname, '../build');

const app = express();
app.set('trust proxy', 1);

app.use(session({
    secret: 'super app for searching',
    cookie: {
        maxAge: config.app.cookie.maxAge,
    },
    resave: true,
    saveUninitialized: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());


// app.use('/**/', (req, res, next) => {
//     console.log(req.session.id);
//
//     next();
// });
// app.use('/', (req, res, next) => {
//     console.log(req.url);
//     next();
// });


app.use('/', (req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

const facebook = require('./socials/facebook');
app.use(config.facebook.path, facebook);

const vkontakte = require('./socials/vkontakte');
app.use(config.vkontakte.path, vkontakte);

app.use('/', express.static(staticFiles));
// app.get('/', (req, res, next) => {
//     console.log(req.session);
//     console.log(res.cookie());
//
//     next();
//
//     // res.render(path.resolve(staticFiles, 'index.html'));
// });

app.get('/api/profile', (req, res) => {
    const sess = req.session;


    res.json({
        vkontakte: !!sess.vkontakte,
        facebook: !!sess.facebook,
    });
});

app.listen(config.app.port);
console.log(`listening on http://localhost:${config.app.port}`);
