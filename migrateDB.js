const mongoose = require('mongoose');
const Blog = require('./models/blog'); // Import your Mongoose model
require('dotenv').config();



async function migrateTagsToStringArray() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Retrieve documents from the collection
        const blogs = await Blog.find({});

        // Update each document
        for (const blog of blogs) {
            // Convert tags field from string to array
            blog.tags = blog.tags ? [blog.tags] : [];

            // Save the updated document
            await blog.save();
        }

        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        // Close the MongoDB connection
        mongoose.connection.close();
    }
}


async function migrateTimestampToCreatedAt() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Retrieve documents from the collection
        const blogs = await Blog.find({});

        // Update each document
        for (const blog of blogs) {
            // Rename the timestamp field to created_at
            blog.created_at = blog.timestamp;
            delete blog.timestamp;

            // Save the updated document
            await blog.save();
        }

        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        // Close the MongoDB connection
        mongoose.connection.close();
    }
}


migrateTimestampToCreatedAt();


// migrateTagsToStringArray();
