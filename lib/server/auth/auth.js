import path from 'path';
import {getOrCreateUser, findUserById, LOCAL_PROVIDER_KEY, VK_PROVIDER_KEY} from './users';
const express = require('express');
const passport = require('passport');


export const addVKontakteAuthSupport = ({app, io, listener, httpPort, httpHost}) => {
    const VKontakteStrategy = require('passport-vkontakte').Strategy;
    const VKONTAKTE_APP_ID = '5571214';
    const VKONTAKTE_APP_SECRET = '6kRe3nRF7PfFxzlTLqZA';
    const callbackURL = `http://${httpHost}:${httpPort}/auth/vkontakte/callback`;
    passport.use(new VKontakteStrategy({
            clientID:     VKONTAKTE_APP_ID, // VK.com docs call it 'API ID'
            clientSecret: VKONTAKTE_APP_SECRET,
            callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            (async() => {
                try {
                    const user = await getOrCreateUser({ provider:VK_PROVIDER_KEY, id: profile.id, profile });
                    return done(null, user);
                } catch (err) {
                    return done(err, null);
                }

            })();

        }
    ));

    app.get('/auth/vkontakte',
        passport.authenticate('vkontakte'),
        function(req, res){
            // The request will be redirected to vk.com for authentication, so
            // this function will not be called.
        });

    app.get('/auth/vkontakte/callback',
        passport.authenticate('vkontakte', { failureRedirect: '/login' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/game');
        });
};

export const addAuthSupport = ({app, io, httpPort, httpHost}) => {
    var Strategy = require('passport-local').Strategy;
    var passportSocketIo = require('passport.socketio');
    var session = require('express-session');
    var RedisStore = require('connect-redis')(session);
    var redis = require("node-redis"),
        client = redis.createClient();
    var cookieParser = require('cookie-parser');
// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
    passport.use('local', new Strategy(
        function (username, password, cb) {
            (async () => {
                try {
                    const user = await getOrCreateUser({provider: LOCAL_PROVIDER_KEY, id: username, profile:{}});
                    if (user.profile.password != password) {
                        throw new Error(`User password is not match ${user.profile.password} / ${password}`);
                    }
                    return cb(null, user);
                } catch (err) {
                    cb(err);
                }

            })();

        }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
    passport.serializeUser(function (user, cb) {
        cb(null, user.id);
    });

    passport.deserializeUser(function (id, cb) {
        findUserById(id, function (err, user) {
            if (err) {
                return cb(err);
            }
            cb(null, user);
        });
    });


// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.

    var secret = 'keyboard cat';
    var key = 'express.sid';
    var sessionOpts = {
        secret: secret, // Keep your secret key
        key: key,
        resave: true,
        saveUninitialized: true,
        cookie: { httpOnly:false },
        store:new RedisStore({
            client: client
        })
    };
    app.use(require('cookie-parser')());
    app.use(require('body-parser').urlencoded({extended: true}));
    app.use(session(sessionOpts));
    app.use(passport.initialize());
    app.use(passport.session());

    io.use(passportSocketIo.authorize({
        passport: passport,
        cookieParser: cookieParser,
        key: key,
        secret: secret,
        store: new RedisStore({client: client}),
        success: onAuthorizeSuccess,  // *optional* callback on success - read more below
        fail: onAuthorizeFail     // *optional* callback on fail/error - read more below
    }));

    function onAuthorizeSuccess(data, accept){
        console.log("onAuthorizeSuccess");
        accept();
    }

    function onAuthorizeFail(data, message, error, accept){
        console.log("onAuthorizeFail", message, error);
        // If you use socket.io@1.X the callback looks different
        // If you don't want to accept the connection
        if(error)
            accept(new Error(message));
        // this error will be sent to the user as a special error-package
        // see: http://socket.io/docs/client-api/#socket > error-object
    }

    // app.get('/', function (req, res) {
    //     res.redirect('/game');
    // });

    // app.get('/game', require('connect-ensure-login').ensureLoggedIn(), (req, res, next) => {
    //     next();
    // });

    // app.get('/login', (req, res, next) => {
    //     next();
    // });
    //
    // app.get('/login',
    //     passport.authenticate('local', { failureRedirect: '/login' }),
    //     function(req, res) {
    //         res.redirect('/game');
    //     });

    app.get('/auth', function (req, res) {
        res.json({ user : req.user });
    });

    app.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return next(new Error('not user ' + JSON.stringify(info))); }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                res.redirect('/game');
            });
        })(req, res, next);
    });

    app.get('/logout',
        function (req, res) {
            req.logout();
            res.redirect('/');
        });

    addVKontakteAuthSupport({app, io, httpPort, httpHost});
};