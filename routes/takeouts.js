const express = require('express')
const router = express.Router()
const Models = require('../config/database')
const auth = require('../config/authenticate')
const multerEngine = require('../config/multerEngine')

router.get('/takeouts', (req, res) => res.send('on the takeout page'))

module.exports = router;