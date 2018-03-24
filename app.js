// config
require('./config/config');

// require third party modules
const express    = require('express');
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
const app        = express();
const passport   = require('passport');
const LocalStrategy = require('passport-local');

// require models
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');

mongoose.connect(process.env.MONGODB_URI);

const seedDB = require('./seeds');
// seedDB();

app.use(express.static(__dirname + '/public'));

//bodyParser middleware
app.use(bodyParser.urlencoded({extended: true}));

// set the view engine
app.set('view engine', 'ejs');

// passport config
app.use(require('express-session')({
    secret: "I don't know what i'm doing",
    resave: 'false',
    saveUninitialized: 'false'
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// custom middleware
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// =====================
// Routes
// =====================

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/campgrounds', (req, res) => {
    Campground.find({})
        .then(campgrounds => {
            res.render('campgrounds/index', {campgrounds});
        })
        .catch(err => {
            console.log(err);
        })
});

app.get('/campgrounds/new', (req, res) =>{
    res.render('campgrounds/new');
});

app.post('/campgrounds', (req, res) => {
    Campground.create({
        name: req.body.name,
        image: req.body.image,
        description: req.body.description
    })
        .then(campground => {
            res.redirect('/campgrounds');
        })
        .catch(err => {
            console.log(err);
        });
});
app.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id)
        .populate('comments')
        .then(campground => {
            res.render('campgrounds/show', {campground});
        })
        .catch(err => console.log(err));
});

// =======================
// COMMENTS ROUTES
// =======================

app.get('/campgrounds/:id/comments/new', isLoggedIn,(req, res) => {
    Campground.findById(req.params.id)
        .then(campground => {
            res.render('comments/new', {campground});
        })
        .catch(err => {
            console.log(err);
        })
});

app.post('/campgrounds/:id/comments', isLoggedIn,(req, res) => {
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

// =======================
// Auth ROUTES
// =======================
app.get('/register', (req, res) => {
    res.render('auth/register');
});

app.post('/register', (req, res) => {
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

app.get('/login', (req, res) => {
    res.render('auth/login');
});

app.post('/login',passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}) ,(req, res) => {

});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campgrounds');
});

function isLoggedIn (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login')
}

app.listen(process.env.PORT, () => {
    console.log(`The server is up on port ${process.env.PORT}`);
});
