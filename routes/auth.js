const express = require('express');
const authRouter = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();


authRouter.post('/signup', passport.authenticate('signup', { session: false }), async (req, res, next) => {
    res.json({
        message: 'Signup successful',
        user: req.user
    });
});



// Login route for users with valid credentials using passport
authRouter.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err || !user) {
                const error = new Error('An error occurred.');
                return next(error);
            }
            req.login(user, { session: false }, async (error) => {
                if (error) return next(error);
                const body = { _id: user._id, email: user.email};
                const token = jwt.sign({ user: body }, process.env.JWT_SECRET);
                // const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: '1h' } );
                return res.json({ info, token, user });
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});


module.exports = authRouter;

