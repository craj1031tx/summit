const express = require('express')
const router = express.Router()
const Models = require('../config/database')
const auth = require('../config/authenticate')
const multerEngine = require('../config/multerEngine')

router.get('/categories/', auth.isAuth, (req, res) => {
    Models.Category.findAll({})
        .then((categories) => res.render('categories/allCategories', {categories: categories, user: req.user}))
        .catch((err) => {
            console.log(err)
            res.send(err)
        })
})

router.get('/categories/add_category', auth.isAdmin, (req, res) => {
    res.render('categories/addCategory')
})

//TODO added an admin auth route to the multer post route for a new cat. Make sure that there is no conflict with the multer file upload
//TODO need to find a way to reject/validate files during/after multer upload. req.file is invalid 
router.post('/categories/add_category', auth.isAdmin, multerEngine.single('categoryImage'), (req, res, next) => { 
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

//admin routes for categories. get all table. 



module.exports = router;