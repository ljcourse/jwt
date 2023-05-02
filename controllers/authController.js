const User = require('../pkg/user/userSchema');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const util = require('util');
const crypto = require('crypto');
const sendEmail = require('./nodemailer');

exports.signUp = async (req, res) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT, {
            expiresIn: process.env.JWT_EXP
        });

        res.cookie('jwt', token, {
            expiress: new Date(Date.now() + process.env.JWT_COOKIE * 24 * 60 * 60 * 1000),
            secure: true,
            httpOnly: true,
        });
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser,
            },
        });
    } catch (err) {
        return res.status(500).send(err)
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('error user');
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send('error email pass');
        }
        const isPasswordValid = bcryptjs.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send('error email pass');
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT, {
            expiresIn: process.env.JWT_EXP
        });
        res.status(201).json({
            status: 'success',
            token,
        });
    } catch (err) {
        return res.status(500).send(err);
    }
};

exports.protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return res.status(500).send("You are not logged in!");
    }

    const decoded = await util.promisify(jwt.verify)(token, process.env.JWT);
    console.log(decoded);
    const userTrue = await User.findById(decoded.id);
    if (!userTrue) {
        return res.status(401).send("User doenst exist!");
    }

    req.user = userTrue;

    next();
};

exports.resetPass = async (req, res) => {
    try {
        const userToken = req.params.token;
        const hashedToken = crypto.createHash("sha256").update(userToken).digest('hex');
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpired: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).send('token invalid');
        }
        user.password = req.body.password;
        user.passwordResetExpired = undefined;
        user.passwordResetToken = undefined;
        const token = jwt.sign({ id: user._id }, process.env.JWT, {
            expiresIn: process.env.JWT_EXP
        });
        res.cookie('jwt', token, {
            expiress: new Date(Date.now() + process.env.JWT_COOKIE * 24 * 60 * 60 * 1000),
            secure: false,
            httpOnly: true,
        });
        res.status(201).json({
            status: 'success',
            token,
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
};
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send('user does not exists');
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest("hex");

        user.passwordResetToken = hashedToken;
        user.passwordResetExpired = Date.now() + 30 * 60 * 1000;
        await user.save({ validateBeforeSave: false });
        const resetUrl = `${req.protocol}://${req.get("host")}/resetPassword/${resetToken}`;
        const message = `error pass ${resetUrl}`;
        await sendEmail({
            email: user.email,
            subject: 'pass reset valid 30min',
            message: message,
        });
        res.status(200).json({
            status: 'success',
            message: 'token sent to email',
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err)
    }
};