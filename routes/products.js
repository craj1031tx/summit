const express = require('express')
const router = express.Router()
const Models = require('../config/database')
const auth = require('../config/authenticate')
const multerEngine = require('../config/multerEngine')

router.get('/categories/:category_id/products', (req, res) => {
    Models.Product.findAll({
        where: {
            categoryId: req.params.category_id
        }
    })
        .then((products) => {
            res.render('products/allProducts', {products: products})
        })
        .catch((err) => res.send(err))
})

router.get('/products/addproduct', (req, res) => res.render('products/addProduct'))

router.post('/products/addproduct', multerEngine.single('productImage'), (req, res, next) => {
    Models.Product.create({
        name: req.body.name,
        shortDescription: req.body.shortDescription,
        longDescription: req.body.longDescription,
        privLevel: 1,
        imageMimeType: req.file.mimetype,
        imageOriginalName: req.file.originalname,
        imageMulterName: req.file.filename,
        categoryId: 1
    })
    .then((savedProduct) => res.redirect('/products'))
    .catch((err) => res.send(err))
})

router.get('/products/testupload', (req, res) => res.render('products/producttest'))

router.post('/products/testupload', multerEngine.single('avatar'), (req, res, next) => {
	Models.Product.create({
        imageOriginalName: req.file.originalname,
        imageMimeType: req.file.mimetype,
        imageMulterName: req.file.filename
		})
        .then((savedFile) => res.redirect('/products/testupload'))
        .catch((err) => res.send(err))        
})

router.get('/products/readupload', (req, res) => {
    Models.Product.findAll({})
        .then(result => {
            if(result.length){
                return res.render('products/productreadupload', {filename: result[0].imageMulterName})
            }
            res.sendStatus(200)
        })
})

module.exports = router;