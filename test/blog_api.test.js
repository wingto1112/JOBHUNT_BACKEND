const { TestWatcher } = require('jest')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const blog = require('../model/blog')
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
    let blogObj = new blog(initialBlogs[0])
    await blogObj.save()
    blogObj = new blog(initialBlogs[1])
    await blogObj.save()
})

test('there are three blogs', async () => {
    const res = await api.get('/api/blogs')
    expect(res.body).toHaveLength(initialBlogs.length)
})



afterAll(() => {
    mongoose.connection.close()
})