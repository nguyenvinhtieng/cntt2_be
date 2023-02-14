const multiparty = require("multiparty");

const Comment = require("../models/Comment");

class CommentController {
    async get(req, res) {
        const post_id = req.params.post_id;
        try {
            Comment.find({}, (err, result) => {
                if (err) return res.status(500).json({ status: false, message: "Có lỗi xảy ra" });
                if (result) {
                    return res.status(200).json({ status: true, message: "Các bình luận của bài viết" + post_id, comments: result });
                }
                return res.status(400).json({ status: false, message: "Không có bài post này" });
            });
        } catch (error) {
            return res.status(500).json({ status: false, message: "Có lỗi xảy ra" });
        }
    }
    async addComment(req, res) {
        const user = req.user;
        try {
            const {post_id, content, reply_id} = req.body;
            if (content == "" || content == undefined) {
                return res.status(400).json({ status: false, message: "Nội dung bình luận không được để trống" });
            }
            const comment = new Comment({
                author: user._id,
                post_id: post_id,
                content: content,
                reply_id: reply_id,
            });
            await comment.save();
            let cmt = await Comment.findOne({ _id: comment._id }).populate("author");
            return res.status(200).json({ status: true, message: "Thêm bình luận thành công", comment: cmt });
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    }
    async deleteComment(req, res) {
        const user = req.user
        try {
            const { comment_id } = req.body;
            if(comment_id == "" || comment_id == undefined) {
                return res.status(400).json({ status: false, message: "Không có comment_id" });
            }
            await Comment.findOneAndRemove({ _id: comment_id, author: user._id });
            await Comment.updateMany({ reply_id: comment_id }, { $set: { reply_id: null } });
            return res.json({ status: true, message: "Xóa bình luận thành công" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: false, message: error.message });
        }
    }
    async updateComment(req, res) {
        const user = req.user
        try {
            const { comment_id, content } = req.body;
            if(content == "" || content == undefined) {
                return res.status(400).json({ status: false, message: "Nội dung bình luận không được để trống" });
            }
            await Comment.findOneAndUpdate({_id: comment_id, author: user._id}, {content: content});
            return res.json({ status: true, message: "Cập nhật bình luận thành công" });
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    }
}

module.exports = new CommentController();
