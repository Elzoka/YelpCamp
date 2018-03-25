// config
require('./config/config');

// require third party modules
const express        = require('express');
const bodyParser     = require('body-parser');
const mongoose       = require('mongoose');
const app            = express();
const passport       = require('passport');
const LocalStrategy  = require('passport-local');
const methodOverride = require('method-override');
const flash          = require('connect-flash');

// require models
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');

mongoose.connect(process.env.MONGODB_URI);

//method-override middleware
app.use(methodOverride('_method'));

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

// connect-flash middleware
app.use(flash());

// custom middleware
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.success_msg = req.flash("success");
    res.locals.error_msg = req.flash("error");
    next();
});

// Routes
const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes = require('./routes/comments');
const indexRoutes = require('./routes/index');

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/', indexRoutes);

app.listen(process.env.PORT, () => {
    console.log(`The server is up on port ${process.env.PORT}`);
});
