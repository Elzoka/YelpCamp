const Campground = require('../models/campground');
const Comment = require('../models/comment');

// middleware
function isLoggedIn (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', "You need to be logged in to do that");
    res.redirect('/login')
}
function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id)
            .then(campground => {
                if(campground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash('error', 'You don\'t have permission to do that');
                    res.redirect('back');
                }
            })
            .catch(err => {
                req.flash('error', 'Campground not found');
                res.redirect('back');
            });
    }else{
        req.flash('error', 'You need to be logged in to do that');
        res.redirect("back");
    }
}
function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id)
            .then(comment => {
                if(comment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash('error', 'You don\'t have permission to do that');
                    res.redirect('back');
                }
            })
            .catch(err => {
                res.redirect('back');
            });
    }else{
        req.flash('error', 'You need to be logged in to do that');
        res.redirect("back");
    }
}

module.exports = {
    isLoggedIn,
    checkCommentOwnership,
    checkCampgroundOwnership
}
