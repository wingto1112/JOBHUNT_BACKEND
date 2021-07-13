const dummy = (blogs) => {
    // ...
    return 1
  }
const totalLikes = (listOfBlogs) => {
    const likes = listOfBlogs.map(blog => blog.likes)   
        const reducer = (sum,item) => {
            return sum +item
        }
        return(likes.reduce(reducer, 0)) 
}
const favoriteBlog = (list) => {
    const favor = list.map(blog => blog.likes)
    const maxNum = Math.max(...favor)
    const find = list.find(blog => 
        blog.likes === maxNum) 
    return (
        {
            title: find.title,
            author: find.author,
            likes: find.likes
          }
    )
}

  module.exports = {
    dummy, totalLikes, favoriteBlog
  }