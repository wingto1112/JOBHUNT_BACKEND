const jobRouter = require("express").Router()
const Job = require("../model/job")
const Employer = require("../model/employer")
const Seeker = require("../model/seeker")
const middleware = require('../utils/middleware')
//require("express-async-error")

jobRouter.get("/", async (req, res) => {
    const jobs = await Job.find({})
        //.populate("applicant", { fullName: 1 })
        .populate("employer", { photo: 1 }).populate("photo",{photo: 1})
    res.json(jobs)
})

jobRouter.get("/:id", async (req, res) => {
    const findJob = await Job.findById(req.params.id)
    if (findJob) {
        res.json(findJob)
    } else {
        res.status(404).end()
    }
})
jobRouter.put("/:id/apply", middleware.userExtractor, async (req, res) => {
    const findJob = await Job.findById(req.params.id)
    const user = req.user
    findJob.applicant = findJob.applicant.concat(user.id)
    console.log(findJob)
    const savedJob = await findJob.save()
    const findSeeker = await Seeker.findById(user.id)
    findSeeker.jobsApplied = findSeeker.jobsApplied.concat(req.params.id)
    await findSeeker.save()
    res.status(201).json(savedJob)
})
jobRouter.put("/:id", middleware.userExtractor, async (req, res, next) => {
    const body = req.body
    const updated = await Job.findByIdAndUpdate(req.params.id, body, {
      new: true,
    })
    res.json(updated)
  })
jobRouter.post("/", middleware.userExtractor, async (req, res, next) => {
    const body = req.body
    const user = req.user
    const job = new Job({
        jobTitle: body.jobTitle,
        company: body.company,
        district: body.district,
        salary: body.salary,
        jobDescription: body.jobD,
        jobRequirement: body.jobR,
        employer: user.id,
    })
    const savedJob = await (await job.save()).populate("employer",{id:1,})
    const findEmployer = await Employer.findById(user.id)
    findEmployer.jobs = findEmployer.jobs.concat(savedJob._id)
    await findEmployer.save()  
    res.status(201).json(savedJob)
})
jobRouter.delete("/:id", middleware.userExtractor, async (req, res, next) => {
    const user = req.user
    const findUser = await Employer.findById(user.id)
    await Job.findByIdAndRemove(req.params.id)
    findUser.jobs = findUser.jobs.filter(id => id.toString() !== req.params.id)
    await findUser.save()
    res.status(204).end()
  })
module.exports = jobRouter