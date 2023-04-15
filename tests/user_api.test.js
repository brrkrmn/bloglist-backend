const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

describe('addition of a user', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash1 = await bcrypt.hash('sekret', 10)
        const user1 = new User({ username: 'root', passwordHash: passwordHash1 })
        await user1.save()

        const passwordHash2 = await bcrypt.hash('berk', 10)
        const user2 = new User({ username: 'berk', passwordHash: passwordHash2 })
        await user2.save()
    })
    
    test('succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'brr',
          name: 'berra karaman',
          password: '9749',
        }
    
        await api
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    
        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('fails with an existing username', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'root',
          name: 'huseyin karaman',
          password: 'idiot',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        expect(result.body.error).toContain('expected `username` to be unique')
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('fails with a username shorther than 3 characters', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'us',
            name: 'huseyin karaman',
            password: 'idiot',
        }

        await api   
            .post('/api/users')
            .send(newUser)
            .expect(400)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('fails if password is missing', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'berro',
            name: 'lsls',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('fails if password is shorter than 3 characters', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'berro',
            name: 'lsls',
            password: 'pa'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
}, 100000)

afterAll(async () => {
    await mongoose.connection.close()
})