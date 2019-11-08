const Sequelize = require('sequelize')
const db = require('../config/database')
const Product = require('./Products')

const Category = db.define('category', {
    name: {
        type:Sequelize.STRING
    },
    imageMimeType: {
        type:Sequelize.STRING   //save file type extension for the image
    },
    imagePath: {
        type: Sequelize.TEXT    //the image path on the server
    },
    imageOriginalName: {
        type: Sequelize.TEXT    //the original file name of the image since Multer stores it as a random file name
    }
})

// Category.hasMany(Product)

Category.sync({ force: true })


module.exports = Category;