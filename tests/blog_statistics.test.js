const listHelper = require('./list_helper')

const listWithNoBlog = []
const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
]
const listWithMultipleBlogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
]

describe('finding the favorite blog', () => {
    test('in a empty list returns "no favorite blogs"', () => {
        const result = listHelper.favoriteBlog(listWithNoBlog)
        expect(result).toEqual('no favorite blogs')
    })

    test('in a list with one blog returns that blog', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        expect(result).toStrictEqual(listWithOneBlog[0])
    })

    test('in a list with multiple blogs is calculated right', () => {
        const result = listHelper.favoriteBlog(listWithMultipleBlogs)
        expect(result).toStrictEqual(listWithMultipleBlogs[2])
    })
})

describe('finding the author with the most blogs', () => {
    test('in a list with no blogs returns "no blogs found"', () => {
        const result = listHelper.mostBlogs(listWithNoBlog)
        expect(result).toBe('no blogs found')
    })

    test('in a list with one blog returns that blog', () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        expect(result).toStrictEqual({
            author: "Edsger W. Dijkstra",
            blogs: 1
        })
    })

    test('in a list with multiple blogs returns the most repeated author', () => {
        const result = listHelper.mostBlogs(listWithMultipleBlogs)
        expect(result).toStrictEqual({
            author: "Robert C. Martin",
            blogs: 3
        })
    })
})

describe('finding the author with the most likes', () => {
    test('in a list with no blogs returns "no blogs found"', () => {
        const result = listHelper.mostLikes(listWithNoBlog)
        expect(result).toBe('no blogs found')
    })

    test('in a list with one blog returns that blog', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        expect(result).toStrictEqual({
            author: 'Edsger W. Dijkstra',
            likes: 5
        })
    })

    test('in a list with multiple blogs returns the blog with the most likes', () => {
        const result = listHelper.mostLikes(listWithMultipleBlogs)
        expect(result).toStrictEqual({
            author: 'Edsger W. Dijkstra',
            likes: 17
        })
    })
})