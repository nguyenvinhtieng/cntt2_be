const express = require("express");
const router = express.Router();

const AnswerController = require("../app/controllers/AnswerController");
const checkLogin = require("../app/middleware/checkLogin");

// router.get("/:question_id", AnswerController.get);
router.post("/", checkLogin, AnswerController.addAnswer);
router.post("/edit", checkLogin, AnswerController.editAnswer);
router.post("/delete", checkLogin, AnswerController.deleteAnswer);
router.post("/change-status", checkLogin, AnswerController.changeStatus);
router.post("/vote", checkLogin, AnswerController.voteAnswer);
// router.delete("/:id", AnswerController.delete);
// router.put("/:id", AnswerController.edit);

module.exports = router;
