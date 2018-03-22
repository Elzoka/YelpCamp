// config
require('./config/config');

// require third party modules
const express    = require('express');
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
const app        = express();

// require models
const Campground = require('./models/campground');

mongoose.connect(process.env.MONGODB_URI);

const seedDB = require('./seeds');
// seedDB();

//bodyParser middleware
app.use(bodyParser.urlencoded({extended: true}));

// set the view engine
app.set('view engine', 'ejs');


// Routes
app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/campgrounds', (req, res) => {
    Campground.find({})
        .then(campgrounds => {
            res.render('index', {campgrounds});
        })
        .catch(err => {
            console.log(err);
        })
});

app.get('/campgrounds/new', (req, res) =>{
    res.render('new.ejs');
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
            res.render('show', {campground});
        })
        .catch(err => console.log(err));
});

app.listen(process.env.PORT, () => {
    console.log(`The server is up on port ${process.env.PORT}`);
});
