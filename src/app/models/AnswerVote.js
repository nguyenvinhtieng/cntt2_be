const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnswerVote = new Schema(
    {
        author: { type: Schema.Types.ObjectId, ref: "User" },
        answer_id: { type: String },
        vote: { type: String },
    },
    {
      timestamps: true,
    },
);

module.exports = mongoose.model("AnswerVote", AnswerVote);
