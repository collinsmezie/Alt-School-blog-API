const serializeBlogs = require('../utils/blogSerializer');
const Blog = require('../models/blog');
const UserModel = require('../models/users');
const calculateReadingTime = require('../utils/blogReadTime');
const getCurrentUTCTime = require('../utils/UTCTime');


// Get all published blogs: 
//pagination(page and limit query options) and search(author and title query options)
//sort by timestamp, reading time and read count
async function getAllPublishedBlogs(req, res) {
    const { page = 1, limit = 20, author, title, sortBy } = req.query; // default values for page, limit, author, title, and sortBy
    try {
        const query = { state: 'published' };

        // If author query parameter is provided, search for blogs by author name
        if (author) {
            // Construct a regex pattern to match author name case-insensitively
            const authorRegex = new RegExp(author, 'i');
            query['author.name'] = authorRegex;
        }

        // If title query parameter is provided, search for blogs by title
        if (title) {
            query.title = { $regex: title, $options: 'i' }; // add title filter if provided
        }

        // Define the sort criteria based on the sortBy query parameter
        let sortCriteria = {};
        if (sortBy === 'read_count' || sortBy === 'reading_time' || sortBy === 'timestamp') {
            sortCriteria[sortBy] = 1; // Sort by the specified field in ascending order
        }

        const blogs = await Blog.find(query)
            .sort(sortCriteria) // Sort the blogs based on the specified criteria
            .skip((page - 1) * limit) // Skip blogs based on page and limit
            .limit(limit); // Limit the number of blogs per page

        const blogPosts = serializeBlogs(blogs);
        const totalCount = await Blog.countDocuments(query); // Get total count of published blogs based on query

        res.json({
            data: blogPosts,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get all blogs for a user: pagination(page query option)
//filter by state query option(published or draft)
async function getAllBlogsByUserId(req, res) {
    try {
        const userId = req.user._id;
        const authorId = req.params.authorId;
        const { state, page } = req.query;

        if (!authorId) {
            return res.status(400).json({ error: 'Bad request - No author id provided' });
        }

        const user = await UserModel.findById(userId).exec();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userInfo = {
            username: user.first_name + " " + user.last_name,
            email: user.email
        };

        const query = { 'author.id': authorId };

        if (state) {
            query.state = state;
        }

        const limit = 20;
        const skip = (page - 1) * limit;
        const blogs = await Blog.find(query).skip(skip).limit(limit).exec();
    
        // const blogs = await Blog.find(query).exec();

        if (!blogs || blogs.length === 0) {
            return res.status(404).json({ error: 'No blogs found for this user' });
        }

        const blogPosts = serializeBlogs(blogs);

        res.json({ LoggedIn_User: userInfo, blogPosts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


// Get a Single blog by title
async function getPublishedBlogByTitle(req, res) {
    try {
        // Find the blog by title and state 'published'
        const blog = await Blog.findOneAndUpdate(
            { title: req.params.title, state: 'published' },
            { $inc: { read_count: 1 } }, // Increment the read_count field by 1
            { new: true } // Return the updated document
        );

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found or not published' });
        }

        res.json(blog);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

  

// Create a blog using mongoose ORM methods
async function createBlog(req, res) {
    try {
        const userId = req.user._id
        const user = await UserModel.findById(userId)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userInfo = {
            username: user.first_name + " " + user.last_name,
            email: user.email
        }

        
        const newBlogPost = new Blog({
            ...req.body,
            author: {
                name: user.first_name + " " + user.last_name,
                id: userId,
            },
            reading_time: calculateReadingTime(req.body.body),
            timestamp: getCurrentUTCTime()
        });

        if (!newBlogPost) {
            return res.status(400).json({ error: 'Bad request' });
        }
        await newBlogPost.save();
        res.status(201).json({ LoggedIn_User: userInfo, newBlogPost });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Publish a blog by title using mongoose ORM methods
async function publishBlogByTitle(req, res) {
    try {
        const userId = req.user._id
        const user = await UserModel.findById(userId)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userInfo = {
            username: user.first_name + " " + user.last_name,
            email: user.email
        }
        const { title } = req.params;
        const blog = await Blog.findOneAndUpdate(
            { title },
            { $set: { state: 'published' } },
            { new: true }
        );
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json({ LoggedIn_User: userInfo, Message: "Blog Published Successfully", blog});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


// Draft a blog by title using mongoose ORM methods
async function draftBlogByTitle(req, res) {
    try {
        const userId = req.user._id
        const user = await UserModel.findById(userId)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userInfo = {
            username: user.first_name + " " + user.last_name,
            email: user.email
        }
        const { title } = req.params;
        const blog = await Blog.findOneAndUpdate(
            { title },
            { $set: { state: 'draft' } },
            { new: true }
        );
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json({ LoggedIn_User: userInfo, Message: "Blog Draft Success", blog});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


// Edit a blog by title using mongoose ORM methods
async function editBlogByTitle(req, res) {

    try {
        const userId = req.user._id;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userInfo = {
            username: user.first_name + " " + user.last_name,
            email: user.email
        };

        const { title } = req.params;

        console.log(title)



        const updateFields = {
            ...req.body,
            reading_time: req.body.body ? calculateReadingTime(req.body.body) : undefined,
            timestamp: getCurrentUTCTime()  
        } // Fields to update sent in the request body

        console.log(req.body)

        console.log("Update fields:", updateFields);

        // Create the update object dynamically based on the fields to update
        const updateObject = {};
        for (const [key, value] of Object.entries(updateFields)) {
            updateObject[key] = value;
        }

        // Update the blog document
        const updatedBlog = await Blog.findOneAndUpdate(
            { title },
            { $set: updateObject },
            { new: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.json({ LoggedIn_User: userInfo, Message: "Blog Edited Successfully", updatedBlog});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}



// Delete a blog by title using mongoose ORM methods
async function deleteBlogByTitle(req, res) {
    try {
      const userId = req.user._id;
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const userInfo = {
        username: user.first_name + " " + user.last_name,
        email: user.email
      };
  
      const { title } = req.params;
  
      // Delete the blog document
      const deletedBlog = await Blog.findOneAndDelete(
        { title }
      );
  
      if (!deletedBlog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
  
      res.json({ LoggedIn_User: userInfo, Message: "Blog Deleted Successfully", deletedBlog});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  


module.exports = {
    getAllPublishedBlogs,
    getAllBlogsByUserId,
    getPublishedBlogByTitle,
    createBlog,
    publishBlogByTitle,
    draftBlogByTitle,
    editBlogByTitle,
    deleteBlogByTitle
};


