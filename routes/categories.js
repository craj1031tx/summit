const express = require('express')
const router = express.Router()
const Models = require('../config/database')
const multerEngine = require('../config/multerEngine')

router.get('/', (req, res) => {
    Models.Category.findAll({})
        .then((categories) => res.render('categories/allCategories', {categories: categories}))
        .catch((err) => {
            console.log(err)
            res.send(err)
        })
})

router.get('/addcategory', (req, res) => {
    res.render('categories/addCategory')
})

router.post('/addcategory', multerEngine.single('categoryImage'), (req, res, next) => {
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

router.get('/:id', (req, res) => {
    res.send(req.params.id)
})



module.exports = router;