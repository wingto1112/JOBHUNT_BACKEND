const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    photo: {
        type: String
    },
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employer"
    },
});

module.exports = mongoose.model("Image", userSchema);