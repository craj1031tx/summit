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

//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

//Express Router files
app.use('/users', require('./routes/users'))
app.use('/products', require('./routes/products'))
app.use('/assets', require('./routes/assets'))
app.use('/categories', require('./routes/categories'))

app.get('/', (req, res) => {
    res.render('index', { layout: 'landing'});
})

db.sequelize.sync({force: true}).then(() => {
    app.listen(process.env.PORT)
}) 


