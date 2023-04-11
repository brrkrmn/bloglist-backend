const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'This is the first blog',
        author: 'Berra',
        url: 'url1',
        likes: 3,
    },
    {
        title: 'second blog',
        author: 'Esma',
        url: 'url2',
        likes: 9,
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb
}