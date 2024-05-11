async function isBlogAuthor(req, res, next) {
    try {
      const userId = req.user._id;
      const authorId = req.params.authorId;
  
    //   const blog = await Blog.findOne({ _id: blogId, 'author.id': userId }).exec();
    // console.log(authorId, userId);

      if (authorId === userId) {
        // User is the owner, proceed with the next middleware or route handler
        next();
    } else {
        // User is not the owner, return a forbidden error
        return res.status(403).json({ error: 'Unauthorized to access these blogs'});
    }
  
    //   if (!blog) {
    //     return res.status(403).json({ error: 'Unauthorized to access this blog' });
    //   }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  module.exports = isBlogAuthor;