const express = require('express');
const bodyParser = require('body-parser');
const app = express();

let campgrounds = [
    {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1468956398224-6d6f66e22c35?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5d2e4d45d037053be722233b79bd0510&auto=format&fit=crop&w=1955&q=80"},
    {name: "Granite Hill", image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d1c8cc988efddbda8746281871c0c8bf&auto=format&fit=crop&w=1259&q=80"},
    {name: "Mountain Goat's Rest", image: "https://images.unsplash.com/photo-1432817495152-77aa949fb1e2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a6f210acc36ab5742aa863e7a2240a2a&auto=format&fit=crop&w=1349&q=80"}
];

// config
require('./config/config');

//bodyParser middleware
app.use(bodyParser.urlencoded({extended: true}));

// set the view engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/campgrounds', (req, res) => {
    res.render('campgrounds', {campgrounds});
});

app.get('/campgrounds/new', (req, res) =>{
    res.render('new.ejs');
});

app.post('/campgrounds', (req, res) => {
    const newCampground = {
        name: req.body.name,
        image: req.body.image
    }
    campgrounds.push(newCampground);
    res.redirect('/campgrounds');
});

app.listen(process.env.PORT, () => {
    console.log(`The server is up on port ${process.env.PORT}`);
});
