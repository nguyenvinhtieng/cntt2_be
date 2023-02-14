const express = require('express');
const router = express.Router()
const AuthController = require('../app/controllers/AuthController.js');
const checkLogin = require("../app/middleware/checkLogin");

router.get('/fetch-data-user',checkLogin, AuthController.fetchDataUser);
router.post('/fetch-user', AuthController.fetchUserInfo);
router.post('/change-avatar', checkLogin, AuthController.changeAvatar);
router.post('/user-update', checkLogin, AuthController.userUpdate);
router.post('/login', AuthController.login)
router.post('/upload-file', AuthController.uploadFile)
// fake
// router.post('/fake-login', AuthController.fakeLogin)
router.post('/register', AuthController.register)
router.post('/forgot-pass', AuthController.forgotPass)
router.post('/change-pass',checkLogin, AuthController.changePass)
router.get('/reset-password', AuthController.forgotPass)
router.post('/reset-password', AuthController.checkToken)


module.exports = router;
