const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = new Schema(
    {
        author: {type: Schema.Types.ObjectId, ref: "User"},
        post_id: { type: String },
        content: { type: String },
        reply_id: { type: String },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Comment", Comment);
