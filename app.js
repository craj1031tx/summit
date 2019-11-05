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


//authentication functions import. move to all routing files later?
const authenticate = require('./config/authenticate')


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

//Express Router files
app.use('/users', require('./routes/users'));

//placeholder users field for synthetic database
const users =[]

//require passport configuation and perform checks (reconfigure during database integration?)
const initializePassport = require('./config/passport-config')
initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)   
);

app.get('/', authenticate.checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name });
})

// app.get('/login', authenticate.checkNotAuthenticated, (req, res) => {
//     res.render('login.ejs');
// })

// app.post('/login', authenticate.checkNotAuthenticated, passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true
// }))


// app.get('/register', authenticate.checkNotAuthenticated, (req, res) => {
//     res.render('register.ejs');
// })

// app.post('/register', authenticate.checkNotAuthenticated, async (req, res) => {
//     try {
//         const hashedPassword = await bcrypt.hash(req.body.password, 10)
//         users.push({
//             id: Date.now().toString(),
//             name: req.body.name,
//             email: req.body.email,
//             password: hashedPassword
//         })
//         console.log(users)
//         res.redirect('/login')
//     } catch (error) {
//         res.render("/register")
//     }
// })

// app.delete('/logout', (req, res) => {
//     req.logOut()
//     res.redirect('/login')
// })


app.listen(3000)