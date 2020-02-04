//only run dotenv when outside of production environment
if (process.env.NODE_ENV !== 'proudction'){
    require('dotenv').config();
}

const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const passport = require('passport')
const session = require('express-session')
const methodOverride = require('method-override')
const path = require('path')

const flash = require('connect-flash')
const nodemailer = require('nodemailer')

//importing and invoking passport middleware passport
require('./config/passport-config')(passport)
//authentication functions import. move to all routing files later?
const auth = require('./config/authenticate')


//DB connection setup from config file + connect to db
const db = require('./config/database')


//express startup
const app = express()
app.engine('handlebars', exphbs( {defaultLayout: 'main'}));
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


//Nodemailer middleware
let transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
        user: process.env.NODEMAIL_USER,
        pass: process.env.NODEMAIL_PASS
    }
})

transporter.verify(function(error, success) {
    if (error) {
        console.log("NODEMAILER ERROR: " + error);
    } else {
        console.log("NODEMAILER: Server is ready to take our messages");
    }
});


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

