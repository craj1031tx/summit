module.exports = (sequelize, Datatypes) => {
    const Product = sequelize.define('product', {
        name: {
            type: Datatypes.STRING     
        },
        shortDescription:{
            type: Datatypes.STRING(1234)
        },
        privLevel: {
            type: Datatypes.INTEGER //corresponds to usersLevel has access rights
        },
        imageMimeType: {
            type:Datatypes.STRING   //save file type extension for the image
        },
        imagePath: {
            type: Datatypes.TEXT    //the image path on the server
        },
        imageOriginalName: {
            type: Datatypes.TEXT    //the original file name of the image since Multer stores it as a random file name
        },
        imageMulterName: {
            type: Datatypes.TEXT    //stores the name that multer provides
        },
        isActive: {
            type: Datatypes.BOOLEAN,//is this product currently active and should it be displayed? if false, then don't display for end users but still display for admins
            defaultValue: true
        }
    })

    Product.associate = (models) => {
        Product.belongsTo(models.Category, {as: 'category', foreignKey: 'categoryId'})
    }

    Product.associate = (models) => {
        Product.belongsToMany(models.Asset, {
            through: 'productAsset',
            as: 'assets', 
            foreignKey: 'productId',
            otherKey: 'assetId'
        })
    }

    return Product;
}