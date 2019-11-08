const express = require('express')
const router = express.Router()
const multer = require('multer')
const Product = require('../models/Products')
const auth = require('../config/authenticate')
const mime = require('mime-types')      //converts stored mime type extensions from multer into file extensions. 
const crypto = require('crypto')

//multer configuration
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
      });
    }
  });
var upload = multer({ storage: storage });

router.get('/', (req, res) => {
    res.sendStatus(200);
})

router.get('/addproduct', (req, res) => res.render('products/addproduct'))


router.get('/testupload', (req, res) => res.render('products/producttest'))

router.post('/testupload', upload.single('avatar'), (req, res, next) => {
    Product.create({
        imageOriginalName: req.file.originalname,
        imageMimeType: req.file.mimetype,
        imageMulterName: req.file.filename
    })
        .then((savedFile) => {
            res.redirect('/products/testupload')
        })
        
})

router.get('/readupload', (req, res) => {
    Product.findAll({})
        .then(result => {
            res.render('products/productreadupload', {filename: result[0].imageMulterName})
        })
})

module.exports = router;