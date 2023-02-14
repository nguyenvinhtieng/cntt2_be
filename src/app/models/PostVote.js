const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;
mongoose.plugin(slug);

const PostVote = new Schema({
    post_id: { type: String, required: true },
    user: { type: String, required: true },
    type: { type: String, default: "upvote" },
}, {
    timestamps: true,
});

module.exports = mongoose.model('PostVote', PostVote);