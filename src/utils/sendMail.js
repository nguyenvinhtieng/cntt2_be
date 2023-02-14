const nodemailer = require("nodemailer");
const os = require("os");
let url = "http://localhost:3000/reset-password/"
async function sendMail(receiver, otp) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "vinntieeng@gmail.com",
            pass: "xvlfyluaeqcpqbqf",
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    let contentHTML = "Vui lòng truy cập vào link sau để đổi mật khẩu: </br>" + url+otp;
    let subject = "Yêu cầu đặt lại mật khẩu";
    let content = `Send Email By Nodemailer`;
    let mainOptions = {
        from: "System",
        to: receiver,
        subject: subject,
        text: content,
        html: contentHTML,
    };
    transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log("Message sent: " + info.response);
        }
    });
}
module.exports = sendMail
