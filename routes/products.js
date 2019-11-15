const express = require('express')
const router = express.Router()
const Models = require('../config/database')
const auth = require('../config/authenticate')
const multerEngine = require('../config/multerEngine')

router.get('/categories/:category_id/products', auth.isAuth, (req, res) => {
    Models.Category.findAll({
        where: {
            id: req.params.category_id
        },
        include: {
            model: Models.Product,
            as: 'products'
        }
    })
        .then((results) => {
            res.render('products/allProducts', {results: results[0], user: req.user})
        })
        .catch((err) => res.send(err))
})

router.get('/categories/:category_id/products/addproduct', auth.isAdmin, (req, res) => {
    res.render('products/addProduct', {categoryId: req.params.category_id})
})

router.post('/categories/:category_id/products/addproduct', auth.isAdmin, multerEngine.single('productImage'), (req, res, next) => {
    //TODO need to add validations to image submission
    Models.Product.create({
        name: req.body.name,
        shortDescription: req.body.shortDescription,
        privLevel: 1,
        imageMimeType: req.file.mimetype,
        imageOriginalName: req.file.originalname,
        imageMulterName: req.file.filename,
        categoryId: req.params.category_id
    })
    .then((savedProduct) => res.redirect(`/categories/${req.params.category_id}/products`))
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