const express = require("express");
const router = express.Router();

const ReportController = require("../app/controllers/ReportController.js");
const checkLogin = require("../app/middleware/checkLogin");

router.post("/", checkLogin, ReportController.addReport);
router.get("/", checkLogin, ReportController.getAllReports);
router.post("/delete", checkLogin, ReportController.deleteReport);

module.exports = router;
