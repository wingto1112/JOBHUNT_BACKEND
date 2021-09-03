const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const seekerSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        require: true,
        minLength: 3,
      },
      passwordHash: {
        type: String,
        require: true,
      },
      fullName: String,
      type: String,
      jobsApplied: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },
      ],
})
seekerSchema.plugin(uniqueValidator)
seekerSchema.set("toJSON", {
    transform: (doc, returnObj) => {
        returnObj.id = returnObj._id.toString()
        delete returnObj._id
        delete returnObj._v
    },
})
module.exports = mongoose.model("Seeker", seekerSchema)