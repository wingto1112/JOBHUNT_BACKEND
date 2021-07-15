require('express-async-errors')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcryptjs')
const User = require('../model/user')
const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('super', 10)
        const user = new User({ username: 'admin', passwordHash })
        await user.save()
    })
    test('list user', async () => {
        const list = await api.get('/api/users')
        console.log(list.body)
    })
    test('create OK', async () => {
        const initDB = await User.find({})

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const endDB = await User.find({})
        expect(endDB).toHaveLength(initDB.length + 1)
        const username = endDB.map(u => u.username)
        expect(username).toContain(newUser.username)
    })
    test.only('valid user', async () => {
        const newUser = {
            username: 'mler',
            name: 'Matti Luukkainen',
            password: 'sa',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)         
    })
})
afterAll(() => {
    mongoose.connection.close()
})