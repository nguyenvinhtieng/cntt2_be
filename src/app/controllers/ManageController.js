const multiparty = require("multiparty");
const User = require("../models/User");
const Post = require("../models/Post");
const PostVote = require("../models/PostVote");
const Comment = require("../models/Comment");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const Report = require("../models/Report");

class ManageController {
    async getUsers(req, res) {
        try {
            const users = await User.find({})
            return res.status(200).json({ status: true, message: "Danh sách tất cả người dùng", users: users });
        }catch(error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    }
    async changeStatusUser(req, res) {
        try {
            const { user_id, status } = req.body;
            if(user_id == "" || user_id == undefined) {
                return res.json({ status: false, message: "Không có user_id" });
            }
            if(status == "" || status == undefined) {
                return res.json({ status: false, message: "Không có status" });
            }

            await User.findOneAndUpdate({ _id: user_id }, { $set: { status: status } });
            return res.json({ status: true, message: "Thay đổi trạng thái thành công" });
        }catch(err) {
            return res.status(500).json({ status: false, message: error.message });
        }
    }

    async getPosts(req, res) {
        // const { page, author_name, tags } = req.query;
        try {
            let { page, author_name, title , from_date, to_date, tag, status } = req.body;
            page = page ? page : 1;
            const limit = 10;
            const skip = (page - 1) * limit;
            let filterCondition = {}
            if(title) {
                filterCondition.title = {$regex: title};
            }
            if(status) {
                filterCondition.status = status;
            }
            if(from_date) {
                filterCondition.createdAt = {$gte: new Date(from_date)};
            }
            if(to_date) {
                if(filterCondition.createdAt) {
                    filterCondition.createdAt.$lte = new Date(to_date);
                }else {
                    filterCondition.createdAt = {$lte: new Date(to_date)};
                }
            }
            if(author_name) {
                const author = await User.find({ fullname: {$regex: author_name} });
                filterCondition.author = {$in: author.map(a => a._id)};
            }

            if(tag) {
                filterCondition.tags = {$in: [tag]};
            }
            // if(Object.keys(filterCondition).length > 0) {
            //     let filterConditionArr = [];
            //     for(let [key, value] of Object.entries(filterCondition)) {
            //         filterConditionArr.push({[key]: value});
            //     }
            //     filterCondition = {$or: filterConditionArr}
            // }

            // console.log("filterCondition: ", filterCondition);
            const posts = await Post.find(filterCondition).sort({createdAt: -1}).populate("author").skip(skip).limit(limit).lean();
            const total = await Post.countDocuments(filterCondition);
            for(const [index, p] of posts.entries()) {
                const voteTotal = await PostVote.countDocuments({ post_id: p._id });
                const commentTotal = await Comment.countDocuments({ post_id: p._id });
                posts[index].voteTotal = voteTotal;
                posts[index].commentTotal = commentTotal;
            }
            return res.status(200).json({ status: true, message: "Lấy bài viết thành công!", posts: posts, total: total });
        }catch(error) {
            console.log(error);
            return res.status(500).json({ status: false, message: error.message });
        }
    }

    async getQuestions(req, res) {
        try {
            let { page, author_name, title , from_date, to_date, tag, status } = req.body;
            page = page ? page : 1;
            const limit = 10;
            const skip = (page - 1) * limit;
            let filterCondition = {}
            if(title) {
                filterCondition.title = {$regex: title};
            }
            if(from_date) {
                filterCondition.createdAt = {$gte: new Date(from_date)};
            }
            if(to_date) {
                if(filterCondition.createdAt) {
                    filterCondition.createdAt.$lte = new Date(to_date);
                }else {
                    filterCondition.createdAt = {$lte: new Date(to_date)};
                }
            }
            if(tag) {
                filterCondition.tags = {$in: [tag]};
            }
            if(author_name) {
                const author = await User.find({ fullname: {$regex: author_name} });
                filterCondition.author = {$in: author.map(a => a._id)};
            }
            let answersResolve = await Answer.find({ status: "accepted" });
            if(status == "resolve") {
                filterCondition._id = {$in: answersResolve.map(a => a.question_id)};
            }
            if(status == "unresolve") {
                filterCondition._id = {$nin: answersResolve.map(a => a.question_id)};
            }
            const questions = await Question.find(filterCondition)
                .sort({createdAt: -1})
                .populate("author")
                .skip(skip)
                .limit(limit)
                .lean();
            const total = await Question.countDocuments(filterCondition);
            for(const [index, q] of questions.entries()) {
                const answers = await Answer.find({ question_id: q._id });
                questions[index].answers = answers;
            }
            return res.status(200).json({ status: true, message: "Lấy câu hỏi thành công!", questions: questions, total: total });

        }catch(error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    }

    async getReports(req, res) {
        try {
            let reports = await Report.find({}).sort({createdAt: -1}).populate("reporter").lean();
            return res.status(200).json({ status: true, message: "Lấy báo cáo thành công!", reports: reports });
        }catch(error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    }
}

module.exports = new ManageController();
