const express = require('express');
const router = express.Router();

const BookMarkController = require('../app/controllers/BookMarkController.js');
const checkLogin = require('../app/middleware/checkLogin.js')

router.post("/", checkLogin, BookMarkController.toggleBookmark);
router.get("/my-bookmarks", checkLogin, BookMarkController.getMyBookmark);

module.exports = router;
