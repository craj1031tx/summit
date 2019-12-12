module.exports = (sequelize, Datatypes) => {
    const Asset = sequelize.define('asset', {
        name: {
            type: Datatypes.STRING       
        },
        contentType: {
            type: Datatypes.STRING
        },
        privLevel: {
            type: Datatypes.INTEGER //corresponds to usersLevel has access rights
        },
        assetMimeType: {
            type:Datatypes.STRING   //save file type extension for the image
        },
        assetPath: {
            type: Datatypes.TEXT    //the image path on the server
        },
        assetOriginalName: {
            type: Datatypes.TEXT    //the original file name of the image since Multer stores it as a random file name
        },
        assetMulterName: {
            type: Datatypes.TEXT    //stores the name that multer provides
        },
        isActive: {
            type: Datatypes.BOOLEAN,//is this product currently active and should it be displayed? if false, then don't display for end users but still display for admins
            defaultValue: true
        }
    })

    Asset.associate = (models) => {
        Asset.belongsToMany(models.Product, {
            through: 'productAsset',
            as: 'products',
            foreignKey: 'assetId',
            otherKey: 'productId'
        })

        Asset.belongsToMany(models.Takeout, {
            through: 'takeoutAsset',
            as: 'assets',
            foreignKey: 'assetId',
            otherKey: 'takeoutId'
        })
    }


    return Asset;
}