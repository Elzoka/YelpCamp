// config
require('./config/config');

// require third party modules
const express    = require('express');
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
const app        = express();


var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//     name: "Granite Hill",
//     image: "https://images.unsplash.com/photo-1493235431945-90c060301e41?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=0279978342b1a6b4f3e0e00a0784c2e3&auto=format&fit=crop&w=1350&q=80",
//     description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
// })
//     .then(campground => {
//
//     });

mongoose.connect(process.env.MONGODB_URI);


//bodyParser middleware
app.use(bodyParser.urlencoded({extended: true}));

// set the view engine
app.set('view engine', 'ejs');

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
        .then(campground => {
            res.render('show', {campground});
        })
        .catch(err => console.log(err));
});

app.listen(process.env.PORT, () => {
    console.log(`The server is up on port ${process.env.PORT}`);
});
