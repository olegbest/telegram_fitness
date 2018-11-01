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
    let attach = [];

    files.forEach((el,i) => {
        attach.push({
            filename: `file-${i}`,
            path: el
        })
    })

    let mail = {
        from: "Hear Hero Service",
        to: email,
        subject: "Курсы",
        html: "<h4>Здравствуйте " + firstName + "</h4>" +
            "<p>Ваш курс. Прикреплен к этому сообщению</p>",
        attachments: attach
    };
    smtpTransport.sendMail(mail, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }

        smtpTransport.close();

    });

}


module.exports.sendMail = sendMail;