const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
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
    test('succeeds with valid data', async () => {
        const newBlog = {
            title: 'new note',
            author: 'new author',
            url: 'new url',
            likes: 0
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    
        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).toContain('new note')
    })

    test('defaults likes to 0 if not defined', async () => {
        const newBlog = {
            title: 'new note',
            author: 'new author',
            url: 'new url',
        }
    
        const result = await api  
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        expect(result.body.likes).toEqual(0)
    })

    test('fails with 400 if title or url is missing', async () => {
        const newBlog = {
            author: 'only author',
        }
    
        await api  
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
        
        const blogsAtEnd = await helper.blogsInDb() 
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
})

describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
        
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).not.toContain(blogToDelete.title)
    })
})

describe('edition of a blog', () => {
    test('suceeds with updated data', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        
        const newBlog = {
            title: 'edited title',
            author: 'edited author',
            url: 'url',
            likes: 90
        }

        const result = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(newBlog)
        
        expect(result.body.title).toBe(newBlog.title)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})