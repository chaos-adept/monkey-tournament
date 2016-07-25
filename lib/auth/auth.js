import path from 'path';

const records = [
    {id: 1, username: 'jack', password: 'secret', displayName: 'Jack', emails: [{value: 'jack@example.com'}]}
    , {id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', emails: [{value: 'jill@example.com'}]}
];


const findUserById = function (id, cb) {
    process.nextTick(function() {
        var idx = id - 1;
        if (records[idx]) {
            cb(null, records[idx]);
        } else {
            cb(new Error('User ' + id + ' does not exist'));
        }
    });
};

const findUserByName = (username, cb) => {
    process.nextTick(function() {
        for (var i = 0, len = records.length; i < len; i++) {
            var record = records[i];
            if (record.username === username) {
                return cb(null, record);
            }
        }
        return cb(null, null);
    });
};

export const addAuthSupport = (app) => {

    console.log('add auth support');
    const express = require('express');
    var passport = require('passport');
    var Strategy = require('passport-local').Strategy;


// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
    passport.use(new Strategy(
        function (username, password, cb) {
            findUserByName(username, function (err, user) {
                if (err) {
                    return cb(err);
                }
                if (!user) {
                    return cb(null, false);
                }
                if (user.password != password) {
                    return cb(null, false);
                }
                return cb(null, user);
            });
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
    app.use(require('cookie-parser')());
    app.use(require('body-parser').urlencoded({extended: true}));
    app.use(require('express-session')({secret: 'keyboard cat', resave: false, saveUninitialized: false}));

// Initialize Passport and restore authentication state, if any, from the
// session.
    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/', function (req, res) {
        res.redirect('/game');
    });
    app.get('/game', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
        res.sendFile(path.join(__dirname, './../../static/', 'game.html'))
    });
    app.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname, './../../static/', 'login.html'))
    });

    app.post('/login',
        passport.authenticate('local', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/game');
        });
    app.post('/logout',
        function (req, res) {
            req.logout();
            res.redirect('/');
        });
};