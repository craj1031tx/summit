const express = require('express')
const router = express.Router()
const passport = require('passport')
const auth = require('../config/authenticate')
const bcrypt = require('bcrypt')
const Models = require('../config/database')

//since the app.js app.use function is already pointing to /users, all routes below will assume url/users is prepended.
//this route is currently set up for testing and does not have any authentication
router.get('/users/', auth.isAuth, (req, res) => {
    Models.User.findAll().then(users => {
        res.render('users/allUsers', {users: users});
      });
})

router.get('/users/login', auth.alreadyAuth, (req, res) => {
    res.render('users/login', { layout: 'landing'});
})

router.post('/users/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/users',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/users/register', auth.alreadyAuth, (req, res) => {
    res.render('users/register', { layout: 'landing'});
})

router.post('/users/register', auth.alreadyAuth, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        Models.User.create({
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

router.delete('/users/logout', (req, res) => {
    req.logOut()
    res.redirect('/users/login')
})


module.exports = router;