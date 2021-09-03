const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
  title: { type: String, require: true },
  author: String,
  url: { type: String, require: true },
  likes: { type: Number, default: 0 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
})

blogSchema.set("toJSON", {
  transform: (doc, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  },
})
module.exports = mongoose.model("Blog", blogSchema)
