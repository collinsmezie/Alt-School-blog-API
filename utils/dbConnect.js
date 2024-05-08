// const mongoose = require('mongoose');

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/mydatabase', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// // Get the default connection
// const db = mongoose.connection;

// // Handle connection error
// db.on('error', console.error.bind(console, 'Connection error:'));

// // Handle successful connection
// db.once('open', () => {
//     console.log('Connected to MongoDB');
// });

// // Export the connection object
// module.exports = db;


const mongoose = require('mongoose');

const URI = "mongodb+srv://collins:IOODaG8iW9uhBA3E@cluster0.wqhme71.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () => {
    try {
        await mongoose.connect( URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB Successfully');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;

//  standalone reusable database connection code file that connects to a mongodb instance and exports the connection object.