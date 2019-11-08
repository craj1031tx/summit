const Sequelize = require('sequelize')
const db = require('../config/database')

const Asset = db.define('asset', {
    name: {
        type: Sequelize.STRING       
    },
    conteType: {
        type: Sequelize.STRING
    },
    privLevel: {
        type: Sequelize.INTEGER //corresponds to usersLevel has access rights
    },
    assetMimeType: {
        type:Sequelize.STRING   //save file type extension for the image
    },
    assetPath: {
        type: Sequelize.TEXT    //the image path on the server
    },
    assetOriginalName: {
        type: Sequelize.TEXT    //the original file name of the image since Multer stores it as a random file name
    },
    assetMulterName: {
        type: Sequelize.TEXT    //stores the name that multer provides
    },
    isActive: {
        type: Sequelize.BOOLEAN,//is this product currently active and should it be displayed? if false, then don't display for end users but still display for admins
        defaultValue: true
    }
})

Asset.sync({ force: false })

// Asset.findAll().then(assets => {
//     console.log("All assets:", JSON.stringify(assets, null, 4));
// });

module.exports = Asset;