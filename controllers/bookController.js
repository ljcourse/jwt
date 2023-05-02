const Blog = require('../pkg/books/bookSchema');
const multer = require('multer');
const uuid = require('uuid');

const imageId = uuid.v4();

const multerStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/img/blogs');
    }, filename: (req, file, callback) => {
        const type = file.mimetype.split('/')[1];
        callback(null, `photo-${imageId}-${Date.now()}.${type}`);
    }
});

const multerFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true);
    } else {
        callback(new Error('file not supported'), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

exports.uploadBlogPhotos = upload.single('picture');

exports.createBlog = async (req, res) => {
    if (req.file) {
        req.body.picture = req.file.filename;
    }
    try {
        const newBlog = await Blog.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                blog: newBlog,
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};

exports.getAllBlogs = async (req, res) => {
    try {
        const blog = await Blog.find();
        res.status(200).json({
            status: 'success',
            data: {
                blogs: blog,
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'err',
            message: err
        });
    }
};

exports.getBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                blog,
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'err',
            message: err,
        });
    }
};

exports.updateBlog = async (req, res) => {
    if (req.file) {
        req.body.picture = req.file.filename;
    }
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            data: {
                blog,
            },
        })
    } catch (err) {
        res.status(400).json({
            status: 'err',
            message: err,
        });
    }
};

exports.replaceBlog = async (req, res) => {
    if (req.file) {
        req.body.picture = req.file.filename;
    }
    try {
        const blog = await Blog.findOneAndReplace({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            status: 'success',
            data: {
                blog,
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err
        });
    }
};