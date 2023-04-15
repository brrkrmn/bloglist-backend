const supertest = require('supertest')
const mongoose = require('mongoose')

const app = require('../app')
const api = supertest(app)

describe('login of a user', () => {
    test('returns token and username with valid user', async () => {
        const user = {
            username: "berk",
            password: "berk"
        }
        // root - sekret
        // berk - berk
        const response = await api
            .post('/api/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const token = (response.body.token)
        console.log(token)
        expect(token).toBeDefined()
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})