//only run dotenv when outside of production environment
if (process.env.NODE_ENV !== 'proudction'){
    require('dotenv').config();
}

var express = require('express')
var expressHandlebars = require('express-handlebars')
var Handlebars = require('handlebars')
var {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const bodyParser = require('body-parser')
const passport = require('passport')
const session = require('express-session')
const methodOverride = require('method-override')
const path = require('path')
const flash = require('connect-flash')


//importing and invoking passport middleware passport
require('./config/passport-config')(passport)
//authentication functions import. move to all routing files later?
const auth = require('./config/authenticate')


//DB connection setup from config file + connect to db
const db = require('./config/database')


//express startup
const app = express()
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars')
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.urlencoded({extended: false}))
app.use(flash())
app.use(methodOverride('_method')) //this middleware allows for using HTTP verbs like DELETE
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,                  //check if this should be true or false, traversy set it to true. same for saveUninitialized below. 
    saveUninitialized: false
}))

//Flash message initialization and global variable instatiation
app.use(flash())
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})


//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())



//Express Router files
app.use('/', require('./routes/users'))
app.use('/', require('./routes/products'))
app.use('/', require('./routes/assets'))
app.use('/', require('./routes/categories'))
app.use('/', require('./routes/takeouts'))
app.use('/', require('./routes/admins'))

app.get('/', auth.alreadyAuth, (req, res) => {
    res.render('index', { layout: 'landing'});
})

db.selectiveSync(app.listen(process.env.PORT, () => console.log('Server is now listening on: ' + process.env.PORT)))

