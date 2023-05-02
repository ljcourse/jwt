const express = require('express');
const morgan = require('morgan');
const app = express();
const db = require('./pkg/db/index');
const auth = require('./controllers/authController');
const book = require('./controllers/bookController');
const bookView = require('./controllers/viewController');
const cookieParser = require('cookie-parser');

db.init();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use((req, res, next) => {
    console.log(req.cookies);
    next();
});

// postman user login, sign up forgot , reset

app.post('/auth/create-acc', auth.signUp);
app.post('/auth/login', auth.login);
app.post('/forgotPass', auth.forgotPassword);
app.post('/resetPassword/:token', auth.resetPass);

// postman book
app.post('/book', book.uploadBlogPhotos, book.createBlog);
// app.get('/book', book.getAllBlogs);

app.get('/book', auth.protect, book.getAllBlogs);
app.get('/book/:id', book.getBlog);
app.delete('/book/:.id', book.deleteBlog);
app.patch('/book/:id', book.uploadBlogPhotos, book.updateBlog);
app.put('/book/:id', book.replaceBlog);

// ejs  book
app.get('/view', auth.protect, bookView.getBlogView);
app.post('/view', book.uploadBlogPhotos, bookView.createBlog);
app.post('/view/delete/:id', bookView.deleteBlog);
app.post('/view/update/:id', book.uploadBlogPhotos, bookView.updateBlog);

//ejs user login 
app.get('/login', bookView.getLoginView);
app.listen(process.env.PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('success');
});