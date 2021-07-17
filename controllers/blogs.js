const blogRouter = require("express").Router()
const Blog = require("../model/blog")
const User = require("../model/user")
const middleware = require('../utils/middleware')
require("express-async-errors")

blogRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 })
  res.json(blogs)
})

blogRouter.get("/:id", async (req, res) => {
  const findBlog = await Blog.findById(req.params.id)
  if (findBlog) {
    res.json(findBlog)
  } else {
    res.status(404).end()
  }
})

blogRouter.post("/", middleware.userExtractor, async (req, res, next) => {
  const body = req.body
  const user = req.user
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

blogRouter.delete("/:id", middleware.userExtractor, async (req, res, next) => {
  const user = req.user
  const findUser = await User.findById(user.id)
  await Blog.findByIdAndRemove(req.params.id)
  findUser.blogs = findUser.blogs.filter(id => id.toString() !== req.params.id)
  await findUser.save()
  res.status(204).end()
})

blogRouter.put("/:id", middleware.userExtractor, async (req, res, next) => {
  const body = req.body
  const updated = await Blog.findByIdAndUpdate(req.params.id, body, {
    new: true,
  })
  res.json(updated)
})

module.exports = blogRouter
