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
    // Models.Asset.findOne({
    //     where: {
    //         id: 1
    //     }
    // })
    // .then((foundAsset) => {
    //     console.log("The found asset is: " + foundAsset)
    //     Models.Product.findOne({
    //         where: {
    //             id: 2
    //         }
    //     })
    //     .then((foundProduct) => {
    //         console.log("The found product is: " + foundProduct)
    //         foundAsset.addProducts(foundProduct)
    //         console.log("The join table was set correctly.")
    //         res.end()
    //     })
    // })

    //this might work for m:m joins? probably a better way to do it though...
    Models.Product.findOne({
        where: {
            id: 2
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

router.get('/assets/addasset', (req, res) => {
    //Get all products to pass a list of products to the front end so that a user can 'select' one - or potentially many - products to add an asset to. 
    Models.Product.findAll({})
    .then((products) => res.render('assets/addAsset', {products:products}))
    .catch((err) => res.send(err))
})

router.post('/assets/addasset', multerEngine.single('asset'), (req, res, next) => {
    //TODO add validations for new assets. 

    Models.Asset.create({
        name: req.body.name,
        contentType: req.body.contentType,
        privLevel: 1,
        assetMimeType: req.file.mimetype,
        assetOriginalName: req.file.originalname,
        assetMulterName: req.file.filename
    })
    .then((savedAsset) => {
        Models.Product.findOne(
            {where: {id: req.body.productId}})
            .then((foundProduct) => {
                savedAsset.addProducts(foundProduct)
                res.redirect('/assets/addasset')
            })
            .catch((err) => {
                console.log(err)
                req.flash('error_msg', "An error occured when associating the asset to the product. Please contact site admin.")
                res.redirect('/')
            })
    })
    .catch((err) => {
        console.log(err)
        req.flash('error_msg', "An error when creating the asset. Please contact site admin.")
        res.redirect('/')
    })
})

router.get('/assets', (req, res) => {
    Models.Asset.findAll({})
    .then((assets) => res.render('assets/adminAllAssets', {assets: assets}))
    .catch(err => res.send(err))
})

//TODO need to get productAsset table assocation so that products that the asset is associated with can be rendered in a table.
//TODO: lots of DB queries here. Do a promise.all?
router.get('/assets/edit/:asset_id', (req, res) => {
    Models.Asset.findOne({
        where: {id: req.params.asset_id}
    })
    .then((asset) => 
        Models.Product.findAll({})
        .then((products) => res.render('assets/adminSingleAsset', {asset: asset, products: products})
        ))
    .catch(err => res.send(err))
})

//Adding extra associations to an asset
//Sequelize already does validation on this to ensure that the association doesn't already exist. Not sure if the Update at value changes?? 
router.post('/assets/add_association/:asset_id', (req, res) => {
    Models.Asset.findOne({
        where: {id: req.params.asset_id}
    })
    .then((foundAsset) => {
        Models.Product.findOne({where: {id: req.body.productId}})
        .then((foundProduct) => {
            foundAsset.addProducts(foundProduct)
            console.log("asset and product associated...")
            res.redirect(`/assets/edit/${req.params.asset_id}`)
        })
        .catch(err => res.send(err))
    })
    .catch(err => res.send(err))
})
module.exports = router;