const fetch = require("node-fetch")
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { backend_laravel, secret_key} = require("../../credentials")
const jwt = require('jsonwebtoken');
const User = require("../models/User")
const Bookmark = require("../models/Bookmark")
const multiparty = require("multiparty");
const uploadImages = require("../../utils/uploadImage");
const uploadFile = require("../../utils/uploadFile");
const sendMail = require("../../utils/sendMail");
const Token = require("../models/Token");
const { deleteToken } = require("../../utils/otpUtils");
const users = require("../../users.json")
const SALT_ROUNDS = 10;
class AuthController {
    async fetchDataUser(req, res, next) {
        let user = req.user;
        try {
            const data = await User.findOne({_id: user._id}).lean();
            const bookmarks = await Bookmark.find({user_id: user._id}).populate("post");
            data.bookmarks = bookmarks;
            return res.json({status: true, message: "Lấy dữ liệu thành công", user: data});
        }catch(e) {
            return res.json({status: false, message: "Có lỗi xảy ra"});
        }
    }

    async fetchUserInfo(req, res, next) {
        try {
            const {slug} = req.body;
            const user = await User.findOne({profileSlug: slug});
            if(!user) {
                return res.json({status: false, message: "Không tìm thấy user này"});
            }
            return res.json({status: true, message: "Lấy dữ liệu thành công", user});
        } catch(e) {
            return res.json({status: false, message: "Lỗi server"});
        }
    }

    async changeAvatar(req, res, next) {
        const user = req.user;
        try {
            const form = new multiparty.Form();
            form.parse(req, async (err, _, files) => {
                if (err) {
                    return res.json({ status: false, message: "Có lỗi xảy ra" });
                }
                if(files.avatar) {
                    if (files?.avatar[0]?.size > 0) {
                        let avatar_link = await uploadImages(files.avatar[0]);
                        avatar_link = avatar_link.url;
                        if(avatar_link) {
                            let userFind = await User.findOneAndUpdate({ _id: user._id }, { avatar: avatar_link }, { new: true });
                            return res.json({ status: true, message: "Cập nhật ảnh đại diện thành công", avatar_link });
                        }
                    }else {
                        res.json({ status: false, message: "Ảnh không hợp lệ" });
                    }
                }else {
                    return res.json({ status: false, message: "Không tìm thấy ảnh" });
                }


            });
        }catch(err) {
            return res.json({ status: false, message: "Có lỗi xảy ra" });
        }
    }

    async uploadFile(req, res, next) {
        try {
            const form = new multiparty.Form();
            form.parse(req, async (err, _, files) => {
                if (err) {
                    return res.json({ status: false, message: "Có lỗi xảy ra" });
                }
                await uploadFile(files.files[0]);
                return res.json({ status: true, message: "Upload file route" });
            })
        }catch(err) {
            return res.json({ status: false, message: "Có lỗi xảy ra" });
        }
    }


    async userUpdate(req, res, next) {
        const user = req.user;
        try {
            const { fullname, interesting, github, facebook, twitter, linkedin, website, instagram} = req.body;
            let interstingUser = interesting.split("~~");
            if(interstingUser.length == 1 && interstingUser[0] == "") {
                interstingUser = [];
            }
            const userFind = await User.findOneAndUpdate({_id: user._id}, {fullname, interesting: interstingUser, github, facebook, twitter, linkedin, website, instagram}, {new: true});
            return res.json({status: true, message: "Cập nhật thành công", user: userFind});
        }catch(err) {
            return res.json({ status: false, message: "Có lỗi xảy ra" });
        }
    }
    async login(req, res, next) {
        try {
            const {username, password} = req.body;

            if(username == "" || password == "") {
                return res.json({status: false, message: "Tên đăng nhập hoặc mật khẩu không được để trống"});
            }
            const user = await User.findOne({username});
            console.log("User: ", username);
            if(!user) {
                return res.json({status: false, message: "Tài khoản hoặc mật khẩu không đúng"});   
            }
            let userPasswordHash = user.password;
            let checkPassword = await bcrypt.compare(password, userPasswordHash);
            if(!checkPassword) {
                return res.json({status: false, message: "Tài khoản hoặc mật khẩu không đúng"});
            }
            if(user.status == "active") {
                let token = jwt.sign({ user }, secret_key);
                return res.json({status: true, message: "Đăng nhập thành công", token, user});
            }
            return res.json({status: false, message: "Tài khoản của bạn đã bị khóa"});
        } catch(e) {
            console.log(e.message);
            return res.json({status: false, message: "Có lỗi xảy ra"});
        }
    }
    async fakeLogin(req, res, next) {
        try {
            const {username, password} = req.body;
            let userData = {
                username: "User default",
                password,
                fullname: "Nguyễn Văn A",
                email: "v@gmail.com",
                phone: "0123456789",
                role: "user"
            };
            let token = jwt.sign({ user: userData }, secret_key);
            return res.json({status: true, message: "Đăng nhập thành công", token, user: userData});
        } catch(e) {
            return res.json({status: false, message: "Có lỗi xảy ra"});
        }
    }
    async register(req, res, next) {
        // register
        try {
            const {username, password, name, email} = req.body;

            if(username == "" || password == "" || name == "" || email == "") {
                return res.json({status: false, message: "Vui lòng điền đầy đủ thông tin"});
            }

            const oldUser = await User.findOne({username});
            if(oldUser) {
                return res.json({status: false, message: "Tên đăng nhập đã tồn tại"});
            }
            const oldUser2 = await User.findOne({email});
            if(oldUser2) {
                return res.json({status: false, message: "Email đã tồn tại"});
            }
            let passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
            const user = new User({
                username,
                password: passwordHash,
                fullname: name,
                email
            })
            await user.save();
            return res.json({status: true, message: "Đăng ký thành công"});
        }catch(err) {
            return res.json({ status: false, message: "Có lỗi xảy ra" });
        }
    }
    async forgotPass(req, res, next) {
        try {
            // const { email } = req.body;
            const email = req.query.email;
            let userFind = await User.findOne({email});
            if(!userFind) {
                return res.json({status: false, message: "Email không tồn tại"});
            }
            // create token 
            // const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const token = uuidv4();

            await sendMail(email, token);
            await Token.findOneAndDelete({email});
            let tk = new Token({
                email,
                token
            });
            await tk.save();
            deleteToken(tk._id);
            return res.json({status: true, message: "Gửi mã resetlink thành công"});
        }catch(err) {
            console.log(err)
            return res.json({ status: false, message: "Server Internal Error!" });
        }
    }
    async checkToken(req, res, next) {
        try {
            const {token, password} = req.body;
            let findToken  = await Token.findOne({token});
            if(!findToken) {
                return res.json({status: false, message: "Token không tồn tại"});
            }
            let email = findToken.email;
            let passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
            await User.findOneAndUpdate({email}, {password: passwordHash});
            return res.json({status: true, message: "Đổi mật khẩu thành công"});
        }catch(err) {
            return res.json({ status: false, message: "Server Internal Error!" });
        }
    }
    async changePass(req, res, next) {
        const user = req.user
        const {password} = req.body;
        try {
            if(password == "") {
                return res.json({status: false, message: "Vui lòng điền đầy đủ thông tin"});
            }
            let passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
            await User.update({username: user.username}, {password: passwordHash})
            return res.json({status: true, message: "Đổi mật khẩu thành công"});
        }catch(err) {
            return res.json({ status: false, message: "Có lỗi xảy ra" });
        }
    }
}

module.exports = new AuthController();
