function serializeBlog(blog) {
    return {
        _id: blog._id,
        title: blog.title,
        description: blog.description,
        tags: blog.tags,
        author: blog.author,
        state: blog.state,
        read_count: blog.read_count,
        reading_time: blog.reading_time,
        body: blog.body,
        timestamp: blog.timestamp
    };
}

function serializeBlogs(blogs) {
    return blogs.map(serializeBlog);
}

module.exports = serializeBlogs
