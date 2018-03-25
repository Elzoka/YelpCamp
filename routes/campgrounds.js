const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const {isLoggedIn, checkCampgroundOwnership} = require('../middleware');

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

// Edit campground route
router.get('/:id/edit', checkCampgroundOwnership,(req, res) => {
        Campground.findById(req.params.id)
            .then(campground => {
                res.render('campgrounds/edit', {campground});
            })
            .catch(err => {
                res.redirect('back');
            });

});

// Updata campground route
router.put('/:id', checkCampgroundOwnership,(req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground)
        .then(campground => {
            res.redirect(`/campgrounds/${req.params.id}`);
        })
        .catch(err => {
            res.redirect('/campgrounds')
        })
});

// Destroy Campground Route
router.delete('/:id', checkCampgroundOwnership,(req, res) => {
    Campground.findByIdAndRemove(req.params.id)
        .then(campground => {
            res.redirect('/campgrounds');
        })
        .catch(err => {
            res.redirect('/campgrounds');
        })
});

module.exports = router;
