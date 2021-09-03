const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")
const employerSchema = new mongoose.Schema({
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
  companyName: String,
  companyWebSite: String,
  contact: String,
  companyProfile: String,
  photo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image"
  },
      type: String,
  jobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
})
employerSchema.plugin(uniqueValidator)
employerSchema.set("toJSON", {
  transform: (doc, returnObj) => {
    returnObj.id = returnObj._id.toString()
    delete returnObj._id
    delete returnObj._v
  },
})
module.exports = mongoose.model("Employer", employerSchema)