const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const {isLoggedIn, checkCommentOwnership} = require('../middleware');


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
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    comment.save();
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

// comments edit route
router.get('/:comment_id/edit', checkCommentOwnership,(req, res) => {
    Comment.findById(req.params.comment_id)
        .then(comment => {
            res.render('comments/edit', {campground_id: req.params.id, comment});
        })
        .catch(err => {
            res.redirect('back');
        })
});

// comments update route
router.put('/:comment_id', checkCommentOwnership,(req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment)
        .then(comment => {
            res.redirect(`/campgrounds/${req.params.id}`);
        })
        .catch(err => {
            res.redirect('back');
        })
});

// Destroy Route
router.delete('/:comment_id', checkCommentOwnership,(req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id)
        .then(comment => {
            res.redirect(`/campgrounds/${req.params.id}`);
        })
        .catch(err => {
            res.redirect('back');
        })
});

module.exports = router;
