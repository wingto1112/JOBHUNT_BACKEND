const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    require: true,
    minLength: 3,
  },
  name: String,
  passwordHash: {
    type: String,
    require: true,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
})

userSchema.plugin(uniqueValidator)
userSchema.set("toJSON", {
  transform: (doc, returnObj) => {
    returnObj.id = returnObj._id.toString()
    delete returnObj._id
    delete returnObj.__v
    delete returnObj.passwordHash
  },
})

module.exports = mongoose.model("User", userSchema)
