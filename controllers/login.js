const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const loginRouter = require("express").Router()
const User = require("../model/employer")
const Seeker = require("../model/seeker")

loginRouter.post("/", async (req, res) => {
    const body = req.body
    let user = await User.findOne({ username: body.username })
      .populate("jobs", {
        jobTitle: 1,
        company: 1,
        district: 1,
        salary: 1,
        jobDescription: 1,
        jobRequirement: 1,
        applicant: 1,
    })
    .populate("photo",{photo: 1})
    if (!user) {
        user = await Seeker.findOne({ username: body.username })
          /*.populate("jobsApplied", {
            jobTitle: 1,
            company: 1, 
         })*/
    }
    console.log(user)
    const pwCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash)

    if (!(user && pwCorrect)) {
        return res.status(401).json({
            error: 'invalid username or password'
        })
    }
    const userForToken = {
        username: user.username,
        id: user._id,
    }
    const token = jwt.sign(userForToken, process.env.SECRET)
    //const userWithToken = {...user._doc, token:token}
    res
        .status(200).send(user.type === 'employer' ? {
            token, 
            username: user.username,
            id:user.id,
            type: user.type,
            jobs: user.jobs, 
            photo: user.photo,
            companyName: user.companyName
        }:'')
})
module.exports = loginRouter
