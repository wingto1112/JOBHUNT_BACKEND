const bcrypt = require("bcryptjs")
const seekerRouter = require("express").Router()
const Seeker = require("../model/seeker")

seekerRouter.get("/", async (req, res) => {
    const seekers = await Seeker.find({}).populate("jobsApplied", {
       jobTitle: 1,
       company: 1, 
    })
    res.json(seekers)
})

seekerRouter.post("/", async(req, res)=>{
    const body = req.body
    if (body.password.length < 3) {
        return res.status(400).send({ error: "password length valid" })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const seeker = new Seeker({
        username: body.username,
        fullName: body.fullName,
        type: body.type,
        passwordHash,
    })
    const savedSeeker = await seeker.save()
    res.json(savedSeeker)
})

module.exports = seekerRouter