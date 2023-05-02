const Book = require('../pkg/books/bookSchema');
const fs = require('fs');

exports.getBlogView = async (req, res) => {
    try {
        const blog = await Book.find();

        res.status(200).render("book", {
            naslovNaStranata: "Books",
            godina: "2023",
            blog,
        });
    } catch (err) {
        res.status(500).send("Error this page");

    }
};

exports.createBlog = async (req, res) => {
    if (req.file) {
        req.body.picture = req.file.filename;
    }
    try {
        const blog = await Book.create(req.body);
        res.status(200).redirect('/view');
    } catch (err) {
        console.log(err);
        res.status(500).send('err')
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const id = req.params.id;
        await Book.findByIdAndDelete(id);
        res.redirect('/view');
    } catch (err) {
        res.status(500).send('error deleting blog');
    }
};

exports.updateBlog = async (req, res) => {
    if (req.file) {
        req.body.picture = req.file.filename;
    }
    try {
        await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).redirect('/view')
    } catch {
        res.status(500).send('err')
    }
};

exports.getLoginView = async (req, res) => {
    try {
        res.status(200).render('login', {
            title: "Login",
        });
    } catch (err) {
        res.status(500).send('error page');
    }
};