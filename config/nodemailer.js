const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
        user: process.env.NODEMAIL_USER,
        pass: process.env.NODEMAIL_PASS
    }
})

transporter.verify(function(error, success) {
    if (error) {
        console.log("NODEMAILER ERROR: " + error);
    } else {
        console.log("NODEMAILER: Server is ready to take our messages");
    }
});

module.exports = transporter