const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
//placeholder users field for synthetic database
const users =[]

app.set('view-engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}))


app.get('/', (req, res) => {
    res.render('index.ejs', { name: "Chetan"});
})

app.get('/login', (req, res) => {
    res.render('login.ejs');
})

app.get('/register', (req, res) => {
    res.render('register.ejs');
})


app.post('/register', (req, res) => {
    console.log('you are now in the weird register block');
    res.redirect('/')
})
app.post('/register', async (req, res) => {
    console.log('in the post block')
    try {
        console.log('inside try block')
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
        console.log(error, 'in the catch block')
        res.render("damnit")
    }
    console.log('do you make it here?')
})


app.listen(3000)