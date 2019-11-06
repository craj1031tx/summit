//only run dotenv when outside of production environment
if (process.env.NODE_ENV !== 'proudction'){
    require('dotenv').config();
}

const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const path = require('path')
const exphbs = require('express-handlebars')


//authentication functions import. move to all routing files later?
const auth = require('./config/authenticate')


//DB connection setup from config file + connect to db
const db = require('./config/database')
db.authenticate()
    .then(() => console.log("Database connected..."))
    .catch(err => console.log("Error: " + err))

//express startup
const app = express()
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars')
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

app.get('/', auth.isAuth, (req, res) => {
    res.render('index', { name: req.user.name });
})



app.listen(3000)