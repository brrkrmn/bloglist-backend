const Blog = require('../models/blog')
const User = require('../models/user')
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

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb, usersInDb
}