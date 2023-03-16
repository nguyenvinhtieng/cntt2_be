const jwt = require("jsonwebtoken");
const User = require("../models/User");
async function checkLogin(req, res, next) {
    let header = req.headers.authorization;
    let token = header && header.split(" ")[1];
    if (!token) {
        return res.json({ success: false, message: "Vui lòng đăng nhập!" });
    }
    try {
        let decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = decoded.user;
        let user_id = user._id;
        const userData = await User.findOne({_id: user_id});
        if(!userData) {
            return res.json({ success: false, message: "Thông tin xác thực không chính xác" });
        }
        req.user = userData;
        next();
    } catch (error) {
        return res.json({ success: false, message: "Có lỗi xảy ra" });
    }
}

module.exports = checkLogin;
