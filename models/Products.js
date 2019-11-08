const Sequelize = require('sequelize')
const db = require('../config/database')
const Category = require('./Categories')

const Product = db.define('product', {
    name: {
        type: Sequelize.STRING     
    },
    shortDescription:{
        type: Sequelize.STRING(1234)
    },
    privLevel: {
        type: Sequelize.INTEGER //corresponds to usersLevel has access rights
    },
    imageMimeType: {
        type:Sequelize.STRING   //save file type extension for the image
    },
    imagePath: {
        type: Sequelize.TEXT    //the image path on the server
    },
    imageOriginalName: {
        type: Sequelize.TEXT    //the original file name of the image since Multer stores it as a random file name
    },
    imageMulterName: {
        type: Sequelize.TEXT    //stores the name that multer provides
    },
    isActive: {
        type: Sequelize.BOOLEAN,//is this product currently active and should it be displayed? if false, then don't display for end users but still display for admins
        defaultValue: true
    }
})


// Product.belongsTo(Category)

//Product.sync with the force setting as true will drop the Product table ever time this is run. 
Product.sync({ force: true })

// Product.findAll().then(products => {
//     console.log("All products:", JSON.stringify(products, null, 4));
// });

module.exports = Product;