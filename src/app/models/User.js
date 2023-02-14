const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;
mongoose.plugin(slug);

const User = new Schema({
    username: { type: String , unique: true , required: true },
    fullname: { type: String },
    email: { type: String },
    profileSlug: { type: String, slug: "username", unique: true },
    avatar: { type: String },
    interesting: { type: Array , default: [] },
    password: { type: String },
    role: { type: String, default: 'user' },
    status: { type: String, default: 'active' },
    github: { type: String , default: '' },
    facebook: { type: String},
    twitter: { type: String },
    linkedin: { type: String },
    website: { type: String },
    instagram: { type: String },
    level: { type: Number, default: 1 },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', User);