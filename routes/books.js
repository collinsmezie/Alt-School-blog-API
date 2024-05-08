const express = require('express');
const booksRouter = express.Router();
const passport = require('passport');
const BookController = require('../controllers/bookController');


booksRouter.get('/books', BookController.getAllBooks);
booksRouter.get('/books/:id', passport.authenticate('jwt', { session: false }), BookController.getBookById);
booksRouter.post('/books', passport.authenticate('jwt', { session: false }), BookController.createBook);
booksRouter.put('/books/:id', passport.authenticate('jwt', { session: false }), BookController.updateBook);
booksRouter.delete('/books/:id', passport.authenticate('jwt', { session: false }), BookController.deleteBook);




module.exports = booksRouter;