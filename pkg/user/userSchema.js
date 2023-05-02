const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'enter email@email.com'],
        lowercase: true,
        unique: true,
        validate: [validator.isEmail, 'enter email@email.com']
    },
    password: {
        type: String,
        required: [true, 'enter password'],
        minlength: [8, 'enter password'],
        validate: [validator.isStrongPassword, 'enter password'],
    },
    passwordResetToken: String,
    passwordResetExpired: Date,
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcryptjs.hash(this.password, 12);
    next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;