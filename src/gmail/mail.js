const mailer = require("nodemailer");
const cfg = require('./config');

let smtpTransport = mailer.createTransport({
    service: "Gmail",
    auth: {
        user: cfg.user,
        pass: cfg.pass
    }
});

function sendMail(firstName, email, files) {

    console.log(files);

    // let mail = {
    //     from: "Hear Hero Service",
    //     to: email,
    //     subject: "Курсы",
    //     html: "<h4>Здравствуйте " + firstName + "</h4>" +
    //         "<p>Ваш курс. Прикреплен к этому сообщению</p>",
    //     attachments: files
    // };
    // smtpTransport.sendMail(mail, function (error, response) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log("Message sent: " + response.message);
    //     }
    //
    //     smtpTransport.close();
    //
    // });

}


module.exports.sendMail = sendMail;