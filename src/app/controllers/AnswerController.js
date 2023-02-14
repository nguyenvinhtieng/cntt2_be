const multiparty = require("multiparty");
const Answer = require("../models/Answer");
const AnswerVote = require("../models/AnswerVote");

class AnswerController {
    async addAnswer(req, res) {
        const user = req.user;
        try {
            const { question_id, content, reply_id } = req.body;
            if(!question_id || !content) {
                return res.json({ status: false, message: "Thiếu thông tin" });
            }
            let answer = new Answer({
                author: user._id,
                question_id,
                content,
                reply_id
            });
            await answer.save();
            let newAnswer = await Answer.findById(answer._id).populate("author").lean();
            return res.json({ status: true, message: "Thêm câu trả lời thành công", answer: newAnswer });
        } catch (err) {
            return res.status(500).json({ status: false, message: "Có lỗi xảy ra" });
        }
    }

    async editAnswer(req, res) {
        const user = req.user;
        try {
            const { answer_id, content } = req.body;
            if(!answer_id || !content) {
                return res.json({ status: false, message: "Thiếu thông tin" });
            }
            let answer = await Answer.findByIdAndUpdate(answer_id, { content }).populate("author").lean();
            if(!answer) {
                return res.json({ status: false, message: "Câu trả lời không tồn tại" });
            }
            return res.json({ status: true, message: "Sửa câu trả lời thành công", answer });
        } catch (err) {
            return res.status(500).json({ status: false, message: "Có lỗi xảy ra" });
        }
    }

    async deleteAnswer(req, res) {
        const user = req.user;
        try {
            const { answer_id } = req.body;
            if(!answer_id) {
                return res.json({ status: false, message: "Thiếu thông tin" });
            }
            let answer = await Answer.findByIdAndDelete(answer_id);
            if(!answer) {
                return res.json({ status: false, message: "Câu trả lời không tồn tại" });
            }
            await Answer.updateMany({ reply_id: answer_id }, { $set: { reply_id: null } })
            return res.json({ status: true, message: "Xóa câu trả lời thành công" });
        } catch (err) {
            return res.status(500).json({ status: false, message: "Có lỗi xảy ra" });
        }
    }
    async changeStatus(req, res) {
        const user = req.user;
        try {
            const { answer_id, status } = req.body;
            if(!answer_id) {
                return res.json({ status: false, message: "Thiếu thông tin" });
            }
            let answer = await Answer.findByIdAndUpdate(answer_id, { status })
            if(!answer) {
                return res.json({ status: false, message: "Câu trả lời không tồn tại" });
            }
            return res.json({ status: true, message: "Thay đổi trạng thái câu trả lời thành công" });
        }catch(err){
            return res.status(500).json({ status: false, message: "Có lỗi xảy ra" });
        }
    }

    async voteAnswer(req, res) {
        const user = req.user;
        try {
            const { answer_id, vote_type } = req.body;
            if(!answer_id) {
                return res.json({ status: false, message: "Thiếu thông tin" });
            }
            let answer = await Answer.findOne({ _id: answer_id}).populate("author").lean();
            if(!answer) {
                return res.json({ status: false, message: "Câu trả lời không tồn tại" });
            }
            let voted = await AnswerVote.findOne({answer_id: answer_id, author: user._id}).lean();
            if(voted) {
                if(voted.vote == vote_type) {
                    await AnswerVote.findByIdAndDelete(voted._id);
                }else {
                    await AnswerVote.findByIdAndUpdate(voted._id, { vote: vote_type });
                }
            }else {
                let answerVote = new AnswerVote({
                    author: user._id,
                    answer_id,
                    vote: vote_type
                });
                await answerVote.save();
            }
            answer.votes = await AnswerVote.find({ answer_id: answer_id }).populate("author").lean();
            return res.json({ status: true, message: "Bình chọn câu trả lời thành công", answer });
        }catch(err){
            return res.status(500).json({ status: false, message: "Có lỗi xảy ra" });
        }
    }
}
module.exports = new AnswerController();
