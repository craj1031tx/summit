//only run dotenv when outside of production environment
if (process.env.NODE_ENV !== 'proudction'){
    require('dotenv').config();
}

const express = require('express')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const path = require('path')


//DB connection setup from config file + connect to db
const db = require('./config/database')
db.authenticate()
    .then(() => console.log("Database connected..."))
    .catch(err => console.log("Error: " + err))

//express startup
const app = express()
app.set('view-engine', 'ejs')
app.use(bodyParser.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method')) //this middleware allows for using HTTP verbs like DELETE

//placeholder users field for synthetic database
const users =[]

//require passport configuation and perform checks (reconfigure during database integration?)
const initializePassport = require('./passport-config')
initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)   
);

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name });
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))


app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        console.log(users)
        res.redirect('/login')
    } catch (error) {
        res.render("/register")
    }
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

//check user authentication. if authenticated, then proceed to next function. if not, then redirect to login.
function checkAuthenticated(req, res, next){
    if (req.isAuthenticated()) {
        return next()
    } 

    res.redirect('/login')
}

//check if a user isn't authenticated. if they are already registered, they shouldn't be able to see some screens (such as login and register screens), so take them back to the homepage.
function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}


app.listen(3000)