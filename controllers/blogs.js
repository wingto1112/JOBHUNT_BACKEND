const blogRouter = require("express").Router()
const Blog = require("../model/blog")
const User = require("../model/user")
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
  const user = await User.findById(body.userID)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  res.json(savedBlog)
})

blogRouter.delete("/:id", async (req, res, next) => {
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
