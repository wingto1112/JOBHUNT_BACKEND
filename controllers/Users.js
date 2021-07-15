const bcrypt = require("bcryptjs")
const usersRouter = require("express").Router()
const User = require("../model/user")
usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
  })
  res.json(users)
})
usersRouter.post("/", async (req, res) => {
  const body = req.body
  if (body.password.length < 3) {
    return res.status(400).send({ error: "passeord length valid" })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()
  res.json(savedUser)
})

module.exports = usersRouter
