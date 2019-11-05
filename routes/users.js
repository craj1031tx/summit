const express = require('express')
const router = express.Router()
const db = require('../config/database')
const User = require('../models/Users')

//since the app.js app.use function is already pointing to /users, all routes below will assume url/users is prepended.
router.get('/', (req, res) => res.send("THIS IS THE USERS PAGE"))

module.exports = router;