const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    transport.verify((err, succ) => {
        if (err) {
            console.log(err);
        } else {
            console.log('email sent');
        }
    });

    const mailOptions = {
        from: "<email@email.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transport.sendMail(mailOptions);
};

module.exports = sendEmail;