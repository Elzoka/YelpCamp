const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

// index route
router.get('/', (req, res) => {
    Campground.find({})
        .then(campgrounds => {
            res.render('campgrounds/index', {campgrounds});
        })
        .catch(err => {
            console.log(err);
        })
});

// New route
router.get('/new', isLoggedIn,(req, res) =>{
    res.render('campgrounds/new');
});

// create route
router.post('/', isLoggedIn,(req, res) => {
    Campground.create({
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    })
        .then(campground => {
            res.redirect('/campgrounds');
        })
        .catch(err => {
            console.log(err);
        });
});

// show route
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id)
        .populate('comments')
        .then(campground => {
            res.render('campgrounds/show', {campground});
        })
        .catch(err => console.log(err));
});

// middleware
function isLoggedIn (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login')
}

module.exports = router;
