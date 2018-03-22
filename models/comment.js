const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    title: String,
    author: String
});

module.exports = mongoose.model('Comment', commentSchema);
