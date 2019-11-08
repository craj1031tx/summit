const express = require('express')
const router = express.Router()
const Models = require('../config/database')
const auth = require('../config/authenticate')
const multerEngine = require('../config/multerEngine')

router.get('/', (req, res) => {
    console.log('in the assets home route')
    Models.Asset.findAll({})
        .then((assets) => {
            console.log('here are the assets that were found: ' + JSON.stringify(assets, null, 4))
            res.render('assets/allAssets', {assets: assets})
        })
        .catch((err) => console.log(err))
})

router.get('/addasset', (req, res) => res.render('assets/addAsset'))

router.post('/addasset', multerEngine.single('asset'), (req, res, next) => {
    Models.Asset.create({
        name: req.body.name,
        privLevel: 1,
        assetMimeType: req.file.mimetype,
        assetOriginalName: req.file.originalname,
        assetMulterName: req.file.filename,
        productId: 1
    })
    .then((savedProduct) => res.redirect('/assets'))
    .catch((err) => res.send(err))
})


module.exports = router;