const Blog = require('../models/blog')
const User = require('../models/user')
const initialBlogs = [
    {
        title: 'First blog by root',
        author: 'root',
        url: 'url1',
    },
    {
        title: 'Second blog by root',
        author: 'root',
        url: 'url2',
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