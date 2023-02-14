const multiparty = require("multiparty");
const QuestionModel = require("../models/Question");
const Question = require("../models/Question");
const uploadFile = require("../../utils/uploadFile");
const uploadImage = require("../../utils/uploadImage");
const Answer = require("../models/Answer");
const AnswerVote = require("../models/AnswerVote");
const User = require("../models/User");
class QuestionController {
    async getQuestionDetail(req, res) {
        let slug = req.params.slug;
        try {
            if(!slug) {
                return res.json({ status: false, message: "Không có slug" });
            }
            let question = await QuestionModel.findOne({ slug }).populate("author").lean();
            if(!question) {
                return res.json({ status: false, message: "Không có câu hỏi" });
            }
            let answers = await Answer.find({ question_id: question._id }).populate("author").lean();
            for(const [index, a] of answers.entries()) {
                let votes = await AnswerVote.find({ answer_id: a._id }).populate("author").lean();
                answers[index].votes = votes;
            }
            question.answers = answers;
            return res.json({ status: true, message: "Lấy câu hỏi thành công", question });
        } catch (err) {
            return res.status(500).json({ status: false, message: "Có lỗi xảy ra" });
        }
    }
    async getPagination(req, res) {
        try {
            
            // const skip = req.query.skip ? parseInt(req.query.skip) : 0;
            const questions = await Question.find({})
                                .populate("author")
                                .sort({createdAt: -1})
                                // .skip(skip)
                                // .limit(10)
                                .lean();
            // const total = await Question.countDocuments();
            for(const [index, q] of questions.entries()) {
                let answers = await Answer.find({ question_id: q._id }).populate("author").lean();
                for(const [index2, a] of answers.entries()) {
                    let votes = await AnswerVote.find({ answer_id: a._id }).populate("author").lean();
                    answers[index2].votes = votes;
                }
                questions[index].answers = answers;
            }
            return res.json({ status: true, message: "Lấy các câu hỏi thành công", questions: questions});
        } catch (err) {
            console.log(err)
            return res.json({ status: false, message: "Có lỗi xảy ra" });
        }
    }

    async getMyQuestion(req, res) {
        const user = req.user;
        try {
            const questions = await Question.find({author: user._id}).sort({createdAt: -1}).populate("author").lean();
            for(const [index, q] of questions.entries()) {
                let answers = await Answer.find({ question_id: q._id }).populate("author").lean();
                questions[index].answers = answers;
            }
            return res.json({ status: true, message: "Lấy các câu hỏi thành công", questions: questions });
        }catch(err) {
            console.log(err)
            return res.json({ status: false, message: "Có lỗi xảy ra" });
        }
    }
    async addQuestion(req, res) {
        let user = req.user;
        try {
            const form = new multiparty.Form();
            form.parse(req, async (err, fields, files) => {
                if (err) return res.status(500).json({ status: false, message: "Có lỗi xảy ra" });
                let title = fields.title[0];
                let content = fields.content[0];
                let tags = fields.tags;
                let files_data = [];
                if (files?.files?.length > 0) {
                    for(const file of files.files) {
                        let fileType = file.headers["content-type"].split("/")[0];
                        if (fileType == "image") {
                            let result = await uploadImage(file);
                            let file_link = result.secure_url;
                            files_data.push({type: "image", url: file_link, public_id: result.public_id, file_name: file.originalFilename, size: file.size})
                        }else {
                            let file_link = await uploadFile(file);
                            files_data.push({type: "file", url: file_link, file_name: file.originalFilename, size: file.size})
                        }
                    }
                }

                let q = new Question({
                    author: user._id,
                    title: title,
                    content: content,
                    tags: tags,
                    files: files_data,
                })
                await q.save();
                let questionNew = await Question.findOne({_id: q._id })
                return res.status(200).json({ status: true, message: "Tạo câu hỏi thành công",  question: questionNew});
            });
        } catch (err) {
            return res.status(500).json({ status: false, message: "Có lỗi xảy ra" });
        }
    }
    async updateQuestion(req, res) {
        const user = req.user;
        try {
            const form = new multiparty.Form();
            form.parse(req, async (err, fields, files) => {
                if (err) return res.status(500).json({ status: false, message: "Có lỗi xảy ra" });
                let question_id = fields.question_id[0];
                let title = fields.title[0];
                let content = fields.content[0];
                let tags = fields.tags;
                let files_data = [];
                const question = await Question.findOne({_id: question_id});
                let fileOldDb = question.files;
                if(fileOldDb.length > 0) {
                    if(fields.files_old) {
                        fileOldDb.forEach(f => {
                            if(fields?.files_old?.indexOf(f.url) != -1) {
                                files_data.push(f)
                            }
                        })
                    }
                }
                if (files?.files?.length > 0) {
                    for(const file of files.files) {
                        let fileType = file.headers["content-type"].split("/")[0];
                        if (fileType == "image") {
                            let result = await uploadImage(file);
                            let file_link = result.secure_url;
                            files_data.push({type: "image", url: file_link, public_id: result.public_id, file_name: file.originalFilename, size: file.size})
                        }else {
                            let file_link = await uploadFile(file);
                            files_data.push({type: "file", url: file_link, file_name: file.originalFilename, size: file.size})
                        }
                    }
                }

                let questionNew = await Question.findOneAndUpdate({_id: question_id}, {
                    title: title,
                    content: content,
                    tags: tags,
                    files: files_data,
                }, {new: true})
                return res.status(200).json({ status: true, message: "Tạo câu hỏi thành công", question: questionNew});
            });
        } catch (err) {
            return res.status(500).json({ status: false, message: "Có lỗi xảy ra" });
        }
    }
    async deleteQuestion(req, res) {
        try {
            const { question_id } = req.body
            if(!question_id) {
                return res.status(400).json({ status: false, message: "Không có question_id" });
            }
            await Question.deleteOne({_id: question_id});
            let answers = await Answer.find({ question_id: question_id });
            for(const a of answers) {
                await AnswerVote.deleteMany({ answer_id: a._id });
            }
            await Answer.deleteMany({ question_id: question_id });
            return res.status(200).json({ status: true, message: "Xóa câu hỏi thành công" });
        } catch (err) {
            console.log(err)
            return res.status(500).json({ status: false, message: "Có lỗi xảy ra" });
        }
    }

}
module.exports = new QuestionController();
