const Answer = require("../models/Answer");
const AnswerVote = require("../models/AnswerVote");
const User = require("../models/User");
const Report = require("../models/Report");
const Post = require("../models/Post");
class QuestionController {
    async addReport(req, res) {
      const user = req.user
      try {
        const { type, report_for, post_id, reason, reason_detail, comment_id } = req.body;
        let post = await Post.findOne({ _id: post_id });
        let link_to = `/post/${post?.slug}`
        if(comment_id) {
          link_to += `?comment_id=${comment_id}`
        }
        const report = new Report({
          reporter: user._id,
          type: type,
          report_for: report_for,
          link_to: link_to,
          reason: reason,
          reason_detail: reason_detail,
        });
        await report.save();

        // create random 200 report
        // for(let i = 0; i < 200; i++) {
        //   const randomUser = await User.aggregate([{ $sample: { size: 1 } }]);
        //   const randomPost = await Post.aggregate([{ $sample: { size: 1 } }]);
        //   const randomReport = new Report({
        //     reporter: randomUser[0]._id,
        //     type: type,
        //     report_for: report_for,
        //     link_to: link_to,
        //     reason: reason,
        //     reason_detail: reason_detail,
        //   });
        //   await randomReport.save();
        // }

        res.status(200).json({status: true, message: "Báo cáo đã được gửi tới admin" });
      }catch(err) {
        res.status(500).json({status: false, message: "Server error" });
      }
    }

    async getAllReports(req, res) {
      try {
        const reports = await Report.find().populate("reporter");
        res.status(200).json({status: true, message: "Reports fetched successfully", data: reports });
      }catch(err) {
        res.status(500).json({status: false, message: "Server error" });
      }
    }

    async deleteReport(req, res) {
      try {
        const {report_id } = req.body;
        await Report.findByIdAndDelete(report_id);
        res.status(200).json({status: true, message: "Report deleted successfully" });
      }catch(err) {
        res.status(500).json({status: false, message: "Server error" });
      }
    }

}
module.exports = new QuestionController();
