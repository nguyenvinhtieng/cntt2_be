const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Bookmark = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    user_id: { type: String },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Bookmark', Bookmark);