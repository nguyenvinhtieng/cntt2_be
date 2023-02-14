const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Report = new Schema({
    reporter: { type: Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, default: "post" }, // post or comment or question
    report_for: { type: String },
    link_to: { type: String },
    reason: { type: String},
    reason_detail: { type: String },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Report', Report);