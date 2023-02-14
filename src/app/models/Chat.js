const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Chat = new Schema(
    {
        sender: { type: Schema.Types.ObjectId, ref: "User" },
        content: { type: String },
        chat_thread_id: { type: String },
        status: { type: String, default: "unread" },
        deleted: { type: Boolean, default: false },
        files: { type: Array, default: [] },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Chat", Chat);
