const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (array) => (
    array.reduce((sum, blog) => (
        sum + blog.likes
    ), 0)
)

const favoriteBlog = (array) => {
    let count = 0
    let favorite = []
    array.map(blog => {
        if (blog.likes > count) {
            count = blog.likes
            favorite = blog
        } 
    })
    return array.length === 0
        ? 'no favorite blogs'
        : favorite
}

const mostBlogs = (array) => {
    const sortedObject = _.countBy(array, 'author')
    const sortedArray = (Object.entries(sortedObject).sort((a,b) => b[1] - a[1]))
  
    if (sortedArray.length === 0) {
        return 'no blogs found'
    } else {
        const favoriteBlog = {
            author: sortedArray[0][0],
            blogs: sortedArray[0][1]
        }
        return favoriteBlog
    }
}

const mostLikes = (array) => {
    if (array.length === 0) {
        return "no blogs found"
    } else {
        
    }
    const sortedObject = _.groupBy(array, 'author')
    const summedLikes = Object.entries(sortedObject).map(author => {
        const authorName = author[0]
        const totalLikes = author[1].reduce((sum, blog) => {
          return sum + blog.likes
        }, 0)
        return {
          author: authorName,
          likes: totalLikes
        }
    })
      
    let highestLike = 0
    const mostLiked = summedLikes.map(sum => {
        if (sum.likes > highestLike) {
          highestLike = sum.likes
          return sum
        } else {
          highestLike = highestLike
        }
    })
    return mostLiked[0]
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}