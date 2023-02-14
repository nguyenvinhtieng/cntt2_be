const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./Post');

const PostReaction = new Schema({
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    username: { type: String },
    type: { type: String, default: "like" },
}, {
    timestamps: true,
});

module.exports = mongoose.model('PostReaction', PostReaction);