const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Token = new Schema(
    {
        email: { type: String },
        token: { type: String },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Token", Token);
