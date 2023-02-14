const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Answer = new Schema(
    {
        author: { type: Schema.Types.ObjectId, ref: "User" },
        question_id: { type: String },
        content: { type: String },
        status: { type: String, default: "" },
        reply_id: { type: String, default: "" },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Answer", Answer);
