const express = require("express");
const router = express.Router();

const QuestionController = require("../app/controllers/QuestionController");
const checkLogin = require("../app/middleware/checkLogin");

router.get("/", QuestionController.getPagination);
router.get("/my-question",checkLogin, QuestionController.getMyQuestion);
router.get("/:slug", QuestionController.getQuestionDetail);
router.post("/", checkLogin, QuestionController.addQuestion);
router.post("/delete",checkLogin, QuestionController.deleteQuestion);
router.post("/update",checkLogin, QuestionController.updateQuestion);

module.exports = router;
