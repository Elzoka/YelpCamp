const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');

const data = [{
    name: "Granite Hill",
    image: "https://images.unsplash.com/photo-1493235431945-90c060301e41?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=0279978342b1a6b4f3e0e00a0784c2e3&auto=format&fit=crop&w=1350&q=80",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
}, {
    name: "Cloud's Rest",
    image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c9fc7ec2cbf1e7f00746ea9f4810613a&auto=format&fit=crop&w=1350&q=80",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
},{
    name: "Desert Mesa",
    image: "https://images.unsplash.com/photo-1515019915774-f4887104b715?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=501083fc474807a378cffa58ab968934&auto=format&fit=crop&w=1350&q=80",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
}]

function seedDB(){
    Campground.remove({})
        .then(() =>{
            console.log('removed Campgrounds');
            data.forEach(campground => {
                Campground.create(campground)
                    .then(createdCampground => {
                        console.log('added a campground');
                        Comment.create({
                            title: 'This place is great, but I wish there was internet',
                            author: 'Homer'
                        }).then(comment => {
                            createdCampground.comments.push(comment);
                            createdCampground.save()
                                .then(campground => {
                                    console.log('saved campground with comment')
                                })
                        })
                        .catch(err => {
                            console.log(err);
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
        })
        .catch(err => {
            console.log(err);
        });
}

module.exports = seedDB;

// Campground.create({
//     name: "Granite Hill",
//     image: "https://images.unsplash.com/photo-1493235431945-90c060301e41?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=0279978342b1a6b4f3e0e00a0784c2e3&auto=format&fit=crop&w=1350&q=80",
//     description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
// })
//     .then(campground => {
//
//     });
