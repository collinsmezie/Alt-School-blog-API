const mongoose = require('mongoose');
const getCurrentUTCTime = require('../utils/UTCTime')


const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },

    description:{
        type: String,
        required: true
    },

    tags: {
        type: [{ type: String, trim: true }], // array of strings
        required: true,
        validate: [arrayNotEmpty, 'Tags cannot be empty']
      },

    author: {

        name: {
            type: String,
            required: true
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Alt_School_User',
            required: true
        }
    },

    state: {
        type: String,
        required: true
    },

    read_count: {
        type: Number,
        default: 0,
        required: true
    },

    reading_time: {
        type: Number,
        default: 0,
        required: true
    },

    body: {
        type: String,
        required: true
    },

    created_at: {
        type: String,
        default: getCurrentUTCTime,
        required: true
    },

    updated_at: {
        type: String
    }

});

function arrayNotEmpty(array) {
    return array && array.length > 0;
}
    


const Blog = mongoose.model('Alt_School_Blog', blogSchema);

module.exports = Blog;
