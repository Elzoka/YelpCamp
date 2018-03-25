const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport   = require('passport');


// root route
router.get('/', (req, res) => {
    res.render('landing');
});

// show register form
router.get('/register', (req, res) => {
    res.render('auth/register');
});

// handling register logic
router.post('/register', (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password)
        .then(user => {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/campgrounds');
            })
        })
        .catch(err => {
            console.log(err);
            res.render('auth/register');
        });
});

// show login route
router.get('/login', (req, res) => {
    res.render('auth/login');
});

// handle login logic
router.post('/login',passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}) ,(req, res) => {

});

// logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campgrounds');
});

module.exports = router;
