const Campground = require('../models/campground');
const Comment = require('../models/comment');

// middleware
function isLoggedIn (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login')
}
function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id)
            .then(campground => {
                if(campground.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect('back');
                }
            })
            .catch(err => {
                res.redirect('back');
            });
    }else{
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
                    res.redirect('back');
                }
            })
            .catch(err => {
                res.redirect('back');
            });
    }else{
        res.redirect("back");
    }
}

module.exports = {
    isLoggedIn,
    checkCommentOwnership,
    checkCampgroundOwnership
}
