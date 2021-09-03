const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema({
    jobTitle: {type: String, require: true},
    company: {type: String, require: true},
    district: {type: String, require: true},
    salary: {type: String, require: true},
    jobDescription: {type: String, require: true},
    jobRequirement: {type: String, require: true},
    applicant: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seeker"
        }
    ],
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employer",
    },
},{ timestamps: { createdAt: 'created_at' } })

jobSchema.set("toJSON", {
    transform: (doc, returnObj) => {
        returnObj.id = returnObj._id.toString()
        delete returnObj._id
        delete returnObj._v
    },
})
module.exports = mongoose.model("Job", jobSchema)