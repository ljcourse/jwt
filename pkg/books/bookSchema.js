const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String
    },
    plot: {
        type: String,
    },
    picture: [String],
    year: {
        type: Number,
    },
    author: {
        type: String,
    },
    rating: {
        type: Number
    },
    genre: {
        type: String,
    },
    price: {
        type: Number,
    },
});

const Book = mongoose.model('book', bookSchema);
module.exports = Book;