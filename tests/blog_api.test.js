const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const rootToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY0M2FhMzhmYzBhOWI4NjUyMmM5ZWVkMCIsImlhdCI6MTY4MTU3NjcwMX0.9m4qVvSaAOvXUgzmJGHUQ_ninmyiEI1jGJCQ72YS_Wc'
const berkToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJlcmsiLCJpZCI6IjY0M2FhMzhmYzBhOWI4NjUyMmM5ZWVkNCIsImlhdCI6MTY4MTU3Njg1NX0.gmsfmloM5vjlrkwrCWAV-xh9K_cYIiIyPcQMMwaAU8c'
let rootBlog

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObjects = helper.initialBlogs
    const response = await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${rootToken}` )
        .send(blogObjects[0])
    await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${rootToken}` )
        .send(blogObjects[1])
    rootBlog = response.body
})

describe('when there is initially some blogs saved', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test("blog's unique identifier property is named id", async () => {
        const response = await api.get('/api/blogs')
        response.body.map(r => {
            expect(r.id).toBeDefined()
        }) 
    })
})

describe('addition of a new blog', () => {
    test('fails if no token is provided', async () => {
        const newBlog = {
            title: 'Unauthenticated test blog',
            author: 'root',
            url: 'nnn',
            likes: 0,
        }

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
        
        expect(response.unauthorized).toBe(true)
    })

    test('succeeds with valid data', async () => {
        const newBlog = {
            title: 'Authenticated test blog',
            author: 'root',
            url: 'nnn',
            likes: 0,
        }
    
        const response = await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${rootToken}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        expect(response.unauthorized).toBe(false)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    
        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).toContain('Authenticated test blog')
    })

    test('defaults likes to 0 if not defined', async () => {
        const newBlog = {
            title: 'new note',
            author: 'new author',
            url: 'new url',
        }
    
        const response = await api  
            .post('/api/blogs')
            .set('Authorization', `bearer ${rootToken}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        expect(response.body.likes).toEqual(0)
        expect(response.unauthorized).toBe(false)
    })

    test('fails with 400 if title or url is missing', async () => {
        const newBlog = {
            author: 'only author',
        }
    
        const response = await api  
            .post('/api/blogs')
            .set('Authorization', `bearer ${rootToken}`)
            .send(newBlog)
            .expect(400)
        
        const blogsAtEnd = await helper.blogsInDb() 
        expect(response.unauthorized).toBe(false)
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
}, 100000)

describe('deletion of a blog', () => {
    test('fails if user is not authorized', async () => {
        await api
            .delete(`/api/blogs/${rootBlog.id}`)
            .set('Authorization', `bearer ${berkToken}`)
            .expect(401)
    })

    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        await api
            .delete(`/api/blogs/${rootBlog.id}`)
            .set('Authorization', `bearer ${rootToken}`)
            .expect(204)
        
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).not.toContain(rootBlog.title)
    })
})

describe('edition of a blog', () => {
    test('fails if user is unauthorized', async () => {
        const newBlog = {
            title: 'not going to be edited'
        }

        await api 
            .put(`/api/blogs/${rootBlog.id}`)
            .set('Authorization', `bearer ${berkToken}`)
            .send(newBlog)
            .expect(401)
    })

    test('suceeds with updated data', async () => {
        const newBlog = {
            title: 'edited title',
            author: 'edited author',
            url: 'url',
        }

        const result = await api
            .put(`/api/blogs/${rootBlog.id}`)
            .set('Authorization', `bearer ${rootToken}`)
            .send(newBlog)
        
        expect(result.body.title).toBe(newBlog.title)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})