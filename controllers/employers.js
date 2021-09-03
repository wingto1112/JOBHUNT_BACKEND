const bcrypt = require("bcryptjs")
const employerRouter = require("express").Router()
const Employer = require("../model/employer")
const middleware = require('../utils/middleware')

employerRouter.get("/:id", async (req, res) => {
    const employers = await Employer.findById(req.params.id)
        .populate("jobs", {
            jobTitle: 1,
            company: 1,
            district: 1,
            salary: 1,
            jobDescription: 1,
            jobRequirement: 1,
            applicant: 1,
        })
        res.json(employers)
})

employerRouter.get("/", async (req, res) => {
    const employers = await Employer.find({})
        .populate("jobs", {
            jobTitle: 1,
            company: 1,
            district: 1,
            salary: 1,
            jobDescription: 1,
            jobRequirement: 1,
            applicant: 1,
        })
        res.json(employers)
})

employerRouter.post("/", async (req, res) => {
    const body = req.body
    if (body.password.length < 3) {
        return res.status(400).send({ error: "password length valid" })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const employer = new Employer({
        username: body.username,
        companyName: body.companyName,
        type: body.type,
        passwordHash,
    })
    const savedEmployer = await employer.save()
    res.json(savedEmployer)
})

employerRouter.put("/:id", middleware.userExtractor, async (req, res, next) => {
    const body = req.body
    const updated = await Employer.findByIdAndUpdate(req.params.id, body, {
      new: true,
    })
    res.json(updated)
  })

module.exports = employerRouter