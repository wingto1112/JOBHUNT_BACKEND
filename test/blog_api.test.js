require('express-async-errors')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const blog = require('../model/blog')
const User = require('../model/user')
const bcrypt = require('bcryptjs')
const api = supertest(app)
const initialBlogs = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    }
]
beforeEach(async () => {
    await blog.deleteMany({})
    for (let blogs of initialBlogs) {
        let blogObj = new blog(blogs)
        await blogObj.save()
    }
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('super', 10)
    const user = new User({ username: 'ben', passwordHash })
    await user.save()
})

test('there are three blogs', async () => {
    const res = await api.get('/api/blogs')
    expect(res.body).toHaveLength(initialBlogs.length)
})

test('_id', async () => {
    const res = await api.get('/api/blogs')
    expect(res.body[0].id).toBeDefined()
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12
    }
    const user = await api.post('/api/login')
        .send({ username: "ben", password: "super" })

    await api.post('/api/blogs')
        .set('Authorization', `bearer ${user.body.token}`)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const res = await api.get('/api/blogs')
        .set('Authorization', `bearer ${user.body.token}`)

    const author = res.body.map(a => a.author)
    expect(res.body).toHaveLength(initialBlogs.length + 1)
    expect(author).toContain('Edsger W. Dijkstra')
})
test('wrong token', async () => {
    const newBlog = {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12
    }
    await api.post('/api/blogs')
        .set('Authorization', 'wrongToken')
        .send(newBlog)
        .expect(401)
})
test('default like', async () => {
    const user = await api.post('/api/login')
        .send({ username: "ben", password: "super" })

    const newBlog = {
        title: "create for like",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    }
    await api.post('/api/blogs')
        .set('Authorization', `bearer ${user.body.token}`)
        .send(newBlog)
    const findBlog = await api.get('/api/blogs')
        .set('Authorization', `bearer ${user.body.token}`)
    const findNewBlog = findBlog.body.find(blog => blog.title === 'create for like')
    expect(findNewBlog.likes = 0)
})

test('title url missing', async () => {
    const user = await api.post('/api/login')
        .send({ username: "ben", password: "super" })

    const newBlog = {
        author: "Edsger W. Dijkstra",
    }
    await api.post('/api/blogs')
        .set('Authorization', `bearer ${user.body.token}`)
        .send(newBlog)
    expect(400)
})

afterAll(() => {
    mongoose.connection.close()
})