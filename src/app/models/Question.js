const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;
mongoose.plugin(slug);

const Question = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User'},
    title: { type: String },
    content: { type: String },
    tags: { type: Array, default: [] },
    pin: { type: Boolean, default: false },
    slug: { type: String, slug: "title", unique: true },
    files: { type: Array, default: [] },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Question', Question);