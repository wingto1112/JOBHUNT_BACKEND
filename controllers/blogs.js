const blogRouter = require('express').Router()
const Blog = require('../model/blog')

blogRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({})
    res.json(blogs)
})

blogRouter.get('/:id', (req, res) => {
    Blog.findById(req.params.id)
        .then(blog => {
            if (blog) {
                res.json(Blog)
            } else {
                res.status(404).end()
            }
        })
})

blogRouter.post('/', (req, res, next) => {
    const body = req.body

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    })
    blog.save()
        .then(saved => {
            res.json(saved)
        })
        .catch(error => next(error))
})

blogRouter.delete('/:id', (req, res, next) => {
    Blog.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

blogRouter.put('/:id', (req, res, next) => {
    const body = req.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
    Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
        .then(updated => {
            res.json(updated)
        })
        .catch(error => next(error))
})

module.exports = blogRouter