const config = require('./app.config');
const passport = require('passport');

const FacebookStrategy = require('passport-facebook').Strategy;
const VKontakteStrategy = require('passport-vkontakte').Strategy;

passport.use(
    new FacebookStrategy({
        clientID: config.facebook.api.appId,
        clientSecret: config.facebook.api.appSecret,
        callbackURL: `http://localhost:${config.app.port}${config.facebook.path}${config.facebook.redirect_url}`
    },
    (accessToken, refreshToken, profile, cb) => {
        return cb(null, {facebook: {accessToken, refreshToken}})
    })
);

passport.use(
    new VKontakteStrategy({
        clientID: config.vkontakte.api.appId,
        clientSecret: config.vkontakte.api.appSecret,
        callbackURL: `http://localhost:${config.app.port}${config.vkontakte.path}${config.vkontakte.redirect_url}`
    },
    (accessToken, refreshToken, profile, cb) => {
        return cb(null, {vkontakte: {accessToken, refreshToken}})
    })
);


passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

module.exports = passport;