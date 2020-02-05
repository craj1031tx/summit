const express = require('express')
const router = express.Router()
const passport = require('passport')
const auth = require('../config/authenticate')
const bcrypt = require('bcrypt')
const Models = require('../config/database')
const crypto = require('crypto')
const mailer = require('../config/nodemailer')

//since the app.js app.use function is already pointing to /users, all routes below will assume url/users is prepended.
//this route is currently set up for testing and does not have any authentication


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
        //TODO need to add crypto function so that it properly embeds in database
        const emailVerificationHashCrypto = crypto.randomBytes(32).toString('hex');
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        Models.User.create({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hashedPassword,
            emailVerificationHash: emailVerificationHashCrypto
        })
        .then((newUser) => {
            console.log("here is the new user: " + JSON.stringify(newUser, null, 4)) //remove console.log for production
            req.flash('success_msg', 'You are now registered, please check your email address to verify you account.')

            //nodemailer message configuration to send user a verification email
            let nodemailerMessage = {
                from: 'Samsung Summit <noreply@samsungsummit.com>', //change this email to production email
                to: 'craj1031tx@gmail.com',  //change this to newUser.email
                subject: 'Please verify your email address for Samsung Summit',
                text: 'Please navigate to localhost:3000/users/verification/'+newUser.emailVerificationHash,
                html: `<p>Please navigate to <a>https://localhost:3000/users/verification/${newUser.emailVerificationHash}</a> to verify your Samsung Summit account</p>`
            }

            mailer.sendMail(nodemailerMessage)

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


router.get('/users/testroute', (req, res) => {
    // let nodemailerMessage = {
    //     from: 'Samsung Summit <noreply@samsungsummit.com>', //change this email to production email
    //     to: 'craj1031tx@gmail.com',
    //     subject: 'Please verify your email address for Samsung Summit',
    //     text: 'Please navigate to localhost:3000/users/verification/'+"thisisarandomhash"
    // }

    // mailer.sendMail(nodemailerMessage)
    // res.sendStatus(200)
})

router.get('/users/verification/:url_email_hash', (req, res) => {
    Models.User.findOne({
        where: { 
            emailVerificationHash: req.params.url_email_hash
        }
    })
    .then((user) => {
        if(user){
            if(user.emailVerified){
                return res.redirect('/')
            }           
            user.emailVerified = true;
            user.save()
            .then(() => {
                req.flash('success_msg', 'Your account has been verified, you may now login')
                return res.redirect('/users/login')
            })            
        } else {
            return res.redirect('/')
        }        
    })
    .catch((err) => console.log(err))
})


module.exports = router;