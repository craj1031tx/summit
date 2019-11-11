const express = require('express')
const router = express.Router()
const Models = require('../config/database')
const multerEngine = require('../config/multerEngine')

router.get('/categories/', (req, res) => {
    Models.Category.findAll({})
        .then((categories) => res.render('categories/allCategories', {categories: categories}))
        .catch((err) => {
            console.log(err)
            res.send(err)
        })
})

router.get('/categories/addcategory', (req, res) => {
    res.render('categories/addCategory')
})

router.post('/categories/addcategory', multerEngine.single('categoryImage'), (req, res, next) => {
    Models.Category.create({
        name: req.body.name,
        imageOriginalName: req.file.originalname,
        imageMimeType: req.file.mimetype,
        imageMulterName: req.file.filename
    })
        .then((savedFile) => {
            res.redirect('/categories/')
        })
        
})

router.get('/categories/:id', (req, res) => {
    res.send(req.params.id)
})



module.exports = router;