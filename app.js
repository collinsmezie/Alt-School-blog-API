require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const bodyParser = require('body-parser');
const blogsRouter = require('./routes/blogs');
const cors = require('cors');
const authRoute = require('./routes/auth');
const connectDB = require('./utils/dbConnect');
require('./authentication/auth');

// Connect to database
connectDB();

// Middleware to allow cross-origin requests
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



// Middleware for authentication
app.use('/', authRoute);
app.use('/api', blogsRouter);


// Middleware for error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


