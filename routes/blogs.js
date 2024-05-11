const express = require('express');
const blogsRouter = express.Router();
const passport = require('passport');
const BlogController = require('../controllers/blogController');
const isBlogOwner = require('../middlewares/authorization/isBlogOwner');
const isBlogAuthor = require('../middlewares/authorization/isBlogAuthor');

const authenticateJWT = passport.authenticate('jwt', { session: false })

blogsRouter.get('/blogs', BlogController.getAllPublishedBlogs);
blogsRouter.get('/blogs/:title', BlogController.getPublishedBlogByTitle);
blogsRouter.get('/blogs/:authorId', authenticateJWT, isBlogAuthor, BlogController.getAllBlogsByUserId);
blogsRouter.post('/blogs', authenticateJWT, BlogController.createBlog);
blogsRouter.put('/blogs/:title/publish', authenticateJWT, isBlogOwner, BlogController.publishBlogByTitle);
blogsRouter.put('/blogs/:title/draft', authenticateJWT, isBlogOwner, BlogController.draftBlogByTitle);
blogsRouter.put('/blogs/:title/edit', authenticateJWT, isBlogOwner, BlogController.editBlogByTitle);
blogsRouter.delete('/blogs/:title/delete', authenticateJWT, isBlogOwner, BlogController.deleteBlogByTitle);


// blogsRouter.route('/blogs/:title')
// //   .get(getBlogByTitle)
//   .put(BlogController.publishBlogByTitle);


module.exports = blogsRouter;