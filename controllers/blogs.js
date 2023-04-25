const blogsRouter = require('express').Router()
const blog = require('../models/blog')
const Blog = require('../models/blog')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.get('/:id', (request, response, next) => {
    Blog.findById(request.params.id)
        .then(blog => {
            if (blog) {
                response.json(blog)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

blogsRouter.post('/', tokenExtractor, userExtractor, async (request, response) => {
    const body = request.body

    if (!body.title || !body.url) {return response.status(400).json({ error: 'content missing' })}

    const user = request.user 
    console.log(user)
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id,
    })
    
    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    console.log(result)
    await user.save()    
    response.status(201).json(result)        
})

blogsRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response) => {
    const user = request.user
    const blog = await Blog.findById(request.params.id)

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', tokenExtractor, userExtractor, async(request, response) => {
    const body = request.body
    const user = request.user
    const blogToBeEdited = await Blog.findById(request.params.id)

    //To temporarily allow like updates    
    // if (blogToBeEdited.user.toString() !== user.id) {
    //     return response.status(401).json({ error: 'unauthorized' })
    // }

    const newBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
    response.json(updatedBlog)
})

module.exports = blogsRouter