const blogRouter = require("express").Router()
const Blog = require("../model/blog")
const User = require("../model/user")
const jwt = require('jsonwebtoken')
require("express-async-errors")

blogRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 })
  res.json(blogs)
})

blogRouter.get("/:id", async (req, res) => {
  const findBlog = await Blog.findById(req.params.id)
  if (findblog) {
    res.json(findBlog)
  } else {
    res.status(404).end()
  }
})

blogRouter.post("/", async (req, res, next) => {
  const body = req.body
  const user = req.user
  console.log(user)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  })
  const savedBlog = await blog.save()
  const findUser = await User.findById(user.id)
  findUser.blogs = findUser.blogs.concat(savedBlog._id)
  await findUser.save()
  res.json(savedBlog)
})

blogRouter.delete("/:id", async (req, res, next) => {
  //const blog = await Blog.findById(req.params.id)
  const user = req.user
  
  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

blogRouter.put("/:id", async (req, res, next) => {
  const body = req.body

  const updated = await Blog.findByIdAndUpdate(req.params.id, body, {
    new: true,
  })
  res.json(updated)
})

module.exports = blogRouter
