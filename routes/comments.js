const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// comments new
router.get('/new', isLoggedIn,(req, res) => {
    Campground.findById(req.params.id)
        .then(campground => {
            res.render('comments/new', {campground});
        })
        .catch(err => {
            console.log(err);
        })
});

// comments create
router.post('/', isLoggedIn,(req, res) => {
    Campground.findById(req.params.id)
        .then(campground => {
            Comment.create(req.body.comment)
                .then(comment => {
                    campground.comments.push(comment);
                    campground.save()
                    res.redirect(`/campgrounds/${campground._id}`);
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err);
            res.redirect('/campgrounds');
        })
});


// middleware
function isLoggedIn (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login')
}
module.exports = router;