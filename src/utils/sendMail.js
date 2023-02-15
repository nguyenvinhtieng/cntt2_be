const nodemailer = require("nodemailer");
const os = require("os");
let url = "https://cntt2-fe.vercel.app/reset-password/"
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
    let contentHTML = `<div style="max-width: 600px; margin-left: auto; margin-right: auto; background: #fff; border-radius: 8px; overflow: hidden;font-family: Verdana, Geneva, Tahoma, sans-serif;">
    <h2 style="padding: 25px; background-color: rgb(59, 115, 220); color: #fff; text-align: center;margin: 0;">Yêu cầu đặt lại mật khẩu</h2>
    <div style="">
      <p>Bạn vừa yêu cầu đổi mật khẩu từ CNTT2</p>
      <p>Để đặt lại mật khẩu, vui lòng nhấn vào nút bên dưới</p>
      <a href="${url + otp}" style="display: inline-block; background-color: rgb(59, 115, 220); color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin: 10px auto;" target="_blank">Đặt lại mật khẩu</a>
      <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</p>
    </div>
  </div>`;
    let subject = "Yêu cầu đặt lại mật khẩu";
    let content = `CNTT 2`;
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
