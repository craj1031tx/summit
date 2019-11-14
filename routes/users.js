const express = require('express')
const router = express.Router()
const passport = require('passport')
const auth = require('../config/authenticate')
const bcrypt = require('bcrypt')
const Models = require('../config/database')

//since the app.js app.use function is already pointing to /users, all routes below will assume url/users is prepended.
//this route is currently set up for testing and does not have any authentication
router.get('/users/', auth.isAdmin, (req, res) => {
    Models.User.findAll().then(users => {
        res.render('users/allUsers', {users: users});
      });
})

router.get('/users/login', auth.alreadyAuth, (req, res) => {
    res.render('users/login', { layout: 'landing'});
})

router.post('/users/login', (req, res, next) => {   //TODO figure out if auth.alreadyAuth should be addded to this post route. It is working normally on the register post route. 
    passport.authenticate('local', {
        successRedirect: '/categories',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/users/register', auth.alreadyAuth, (req, res) => {
    res.render('users/register', { layout: 'landing'});
})

router.post('/users/register', auth.alreadyAuth, async (req, res) => {

    
    // const {firstName, lastName, email, password, password2} = req.body //destructuring from the json in req.body to do controller verification
    // let errors = []
    // if(!firstName || !lastName || !email || !password || !password2){
    //     errors.push({msg: "Please make sure all fields are correctly filled out"})
    // }

    // if(password !== password2){
    //     errors.push({msg: "Please make sure your passwords match"})
    // }

    // if(password.length <= 6 || password.length > 30) {
    //     errors.push({msg: "Please make sure that your password is between 6 and 30 characters."})
    // }

    // if(errors.length > 0){
    //     return res.render('users/register', {firstName, lastName, email, password, password2, layout: 'landing'})
    // }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        Models.User.create({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hashedPassword
        })
        .then((newUser) => {
            console.log("here is the new user: " + JSON.stringify(newUser, null, 4)) //remove console.log for production
            req.flash('success_msg', 'You are now registered and may login')
            res.redirect('/users/login')}
        )
        .catch((valError) => {
            console.log("CREATION ERROR IS: " + valError)
            res.send(valError)
            //res.redirect('/users/register')
        })
    } catch (error) {
        console.log("BCRYPT ERROR IS: " + error)
        res.redirect('/users/register')
    }
})

router.delete('/users/logout', (req, res) => {  //TODO determine if auth.isAuth should be added to this logout DELETE route
    req.logOut()
    res.redirect('/users/login')
})


module.exports = router;