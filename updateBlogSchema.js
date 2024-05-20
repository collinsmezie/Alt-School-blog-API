const Blog = require('./models/blog');

// connect to the database
const connectDB = require('./utils/dbConnect');


async function updateTagsToArray() {
  try {
    await connectDB();

    // Update tags field to be an array if it's a string
    await Blog.updateMany(
      {},
      {
        $set: {
          tags: {
            $cond: [
              { $eq: [{ $type: "$tags" }, "string"] },
              { $split: ["$tags", " "] },
              "$tags",
            ],
          },
        },
      }
    );

    console.log("Tags field updated to arrays where necessary.");
  } catch (error) {
    console.error("Error updating blog tags:", error);
  }
}



// async function updateTagsToArray() {
//   try {
//     await connectDB();

//     // Fetch all blog documents
//     const blogs = await Blog.find({});

//     // Iterate over each document and update the tags field
//     for (const blog of blogs) {
//       if (typeof blog.tags === 'string') {
//         console.log(`Updating blog with ID: ${blog._id}, Title: ${blog.title}`);
//         console.log(`Old Tags: ${blog.tags}`);
      
//         // Split the string into an array of tags
//         blog.tags = blog.tags.split(' ').map(tag => tag.trim());
//         // Save the updated document
//         await blog.save();
//       }
//     }

//     console.log("Tags field updated to arrays where necessary.");
//   } catch (error) {
//     console.error("Error updating blog tags:", error);
//   }
// }

updateTagsToArray();