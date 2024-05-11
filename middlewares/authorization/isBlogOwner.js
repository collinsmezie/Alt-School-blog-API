const Blog = require('../../models/blog'); // Assuming you have a Blog model

// Middleware to check if the logged-in user is the owner of the blog post
const isBlogOwner = async (req, res, next) => {
    try {
        const userId = req.user._id.toString(); // Convert userId to string
        const blog = await Blog.findOne({ title: req.params.title });

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        // Check if the logged-in user is the owner of the blog
        const authorId = blog.author.id.toString() ; // Convert authorId to string
        
        if (authorId === userId) {
            // User is the owner, proceed with the next middleware or route handler
            next();
        } else {
            // User is not the owner, return a forbidden error
            return res.status(403).json({ error: 'Unauthorized to modify or delete this Blog' });
        }
    } catch (err) {
        // Handle any errors that occurred during the middleware execution
        console.error('Error in isBlogOwner middleware:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = isBlogOwner;