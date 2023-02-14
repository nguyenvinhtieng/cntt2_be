const express = require("express");
const router = express.Router();

const ChatController = require("../app/controllers/ChatController");
const checkLogin = require("../app/middleware/checkLogin");

router.post("/create-thread", checkLogin, ChatController.createThread);
router.get("/get-all-thread", checkLogin, ChatController.getAllThread);
router.post("/get-chat-of-thread", checkLogin, ChatController.getChatOfThread);
router.post("/get-chat-with-user", checkLogin, ChatController.getChatWithUser);
// router.post("/get-chat",checkLogin, ChatController.getChat);
router.post("/",checkLogin, ChatController.chat);
router.post("/delete",checkLogin, ChatController.deleteChat);

module.exports = router;
