const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    imagePath: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model('Post', postSchema);