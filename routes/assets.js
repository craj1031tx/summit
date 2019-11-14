const express = require('express')
const router = express.Router()
const Models = require('../config/database')
const auth = require('../config/authenticate')
const multerEngine = require('../config/multerEngine')

router.get('/categories/:category_id/products/:product_id/assets', (req, res) => {
    Models.Product.findOne({
        where: {
            id: req.params.product_id
        },
        include: [
            {
                model: Models.Asset,
                as: "assets"
            }
        ]
    })
    .then((results) => {
        res.render('assets/allAssets', {results: results})
    })
    .catch((err) => res.send(err))
})

router.get('/assettestroute', (req, res) => {
    Models.Product.findOne({
        where: {
            id: 1
        },
        include: [
            {
                model: Models.Asset,
                as: "assets"
            }
        ]
    })
    .then((results) => {
        res.render('assets/allAssets', {results: results})
    })
    .catch((err) => res.send(err))
})

router.get('/assets/addasset', (req, res) => res.render('assets/addAsset'))

router.post('/assets/addasset', multerEngine.single('asset'), (req, res, next) => {
    //TODO add validations for new assets. 

    Models.Asset.create({
        name: req.body.name,
        contentType: req.body.contentType,
        privLevel: 1,
        assetMimeType: req.file.mimetype,
        assetOriginalName: req.file.originalname,
        assetMulterName: req.file.filename,
        productId: 1
    })
    .then((savedProduct) => {
        res.redirect('/assets/addasset')
    })
    .catch((err) => {
        console.log(err)
        req.flash('error_msg', "An error was encountered, please speak to a site administrator.")
        res.redirect('/')
    })
})


module.exports = router;