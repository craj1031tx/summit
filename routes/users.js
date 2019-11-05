const express = require('express')
const router = express.Router()
const db = require('../config/database')
const User = require('../models/Users')
const passport = require('passport')
const authenticate = require('../config/authenticate')
const bcrypt = require('bcrypt')

const initializePassport = require('../config/passport-config')

initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)   
);

//temp users file
const users = []

//since the app.js app.use function is already pointing to /users, all routes below will assume url/users is prepended.
router.get('/', (req, res) => res.send("THIS IS THE USERS PAGE"))

router.get('/login', authenticate.checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
})

router.post('/login', authenticate.checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
}))


router.get('/register', authenticate.checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
})

router.post('/register', authenticate.checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        console.log(users)
        res.redirect('/users/login')
    } catch (error) {
        res.render("/users/register")
    }
})

router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

module.exports = router;