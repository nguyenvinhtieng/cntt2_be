const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatThread = new Schema(
    {
        users: [{ type: Schema.Types.ObjectId, ref: "User" }],
        last_message: { type: Schema.Types.ObjectId, ref: "Chat" },
        new: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("ChatThread", ChatThread);
