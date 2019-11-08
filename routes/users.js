const express = require('express')
const router = express.Router()
const User = require('../models/Users')
const passport = require('passport')
const auth = require('../config/authenticate')
const bcrypt = require('bcrypt')


//since the app.js app.use function is already pointing to /users, all routes below will assume url/users is prepended.
//this route is currently set up for testing and does not have any authentication
router.get('/', (req, res) => {
    User.findAll().then(users => {
        res.render('users/userList', {users: users});
      });
})

router.get('/login', auth.alreadyAuth, (req, res) => {
    res.render('users/login', { layout: 'landing'});
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/users',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/register', auth.alreadyAuth, (req, res) => {
    res.render('users/register', { layout: 'landing'});
})

router.post('/register', auth.alreadyAuth, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        User.create({
            email: req.body.email,
            name: req.body.name,
            password: hashedPassword,
            userLevel: 1
        })
        .then((newUser) => {
            console.log("here is the new user: " + JSON.stringify(newUser, null, 4)) //remove console.log for production
            res.redirect('/users/')}
        )
    } catch (error) {
        res.redirect('/users/register')
    }
})

router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/users/login')
})


//test user route to print out random database information...
router.get('/test', (req, res) => {
    User.findAll({
        limit: 1,
        where: {
            email: "f@f.com"
        }
    })
    .then(
        singleUser => {
            console.log("here is the single user: " + JSON.stringify(singleUser))
            res.send(singleUser[0])
        })
})


module.exports = router;