module.exports = (sequelize, Datatypes) => {
    const Category = sequelize.define('cateogry', {
        name: {
            type:Datatypes.STRING
        },
        imageMimeType: {
            type:Datatypes.STRING   //save file type extension for the image
        },
        imagePath: {
            type: Datatypes.TEXT    //the image path on the server
        },
        imageOriginalName: {
            type: Datatypes.TEXT    //the original file name of the image since Multer stores it as a random file name
        }
    })

    return Category;
}