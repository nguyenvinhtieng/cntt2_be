const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;
mongoose.plugin(slug);

const Post = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String },
    tldr: { type: String },
    content: { type: String },
    thumbnail: { type: String },
    tags: { type: Array, default: [] },
    pin: { type: Boolean, default: false },
    slug: { type: String, slug: "title", unique: true },
    status: { type: String, default: 'public' },
    public_image_id: { type: String },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Post', Post);