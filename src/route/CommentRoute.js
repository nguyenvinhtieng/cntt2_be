const express = require("express");
const router = express.Router();

const CommentController = require("../app/controllers/CommentController");
const checkLogin = require("../app/middleware/checkLogin");

router.get("/:post_id", CommentController.get);
router.post("/", checkLogin, CommentController.addComment);
router.post("/delete", checkLogin, CommentController.deleteComment);
router.post("/update",checkLogin, CommentController.updateComment);

module.exports = router;
