const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionScore = new Schema({
    username: { type: String },
    question_id: { type: String },
    status: { type: Boolean, default: false }, // false: downvote, true: upvote
}, {
    timestamps: true,
});

module.exports = mongoose.model('QuestionScore', QuestionScore);