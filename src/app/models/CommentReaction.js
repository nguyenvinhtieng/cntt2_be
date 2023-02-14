const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentReaction = new Schema({
    comment_id: { type: String },
    username: { type: String },
    type: { type: String, default: "like" },
}, {
    timestamps: true,
});

module.exports = mongoose.model('CommentReaction', CommentReaction);