const Sequelize = require('sequelize');

//TODO learn dotenv so that the db initialization can be condensed into one constructor/function.

//database connection, using sequelize and postgrest. pool size may need to be modified for production
const sequelize = new Sequelize('summit', 'postgres', process.env.POSTGRES_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    pool: { 
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

//Amazon RDS Connection
// const sequelize = new Sequelize('summit', 'postgres', process.env.AWS_RDS_PASSWORD, {
//     host: 'summit-rds.c3euxeeemzq2.us-west-2.rds.amazonaws.com',
//     port: 5432,
//     dialect: 'postgres',
//     pool: { 
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
// });

sequelize.authenticate()
    .then(() => console.log("Database connected..."))
    .catch(err => console.log("Error: " + err))

const models = {
    User: sequelize.import('../models/Users'),
    Category: sequelize.import('../models/Categories'),
    Product: sequelize.import('../models/Products'),
    Asset: sequelize.import('../models/Assets'),
    Takeout: sequelize.import('../models/Takeouts'),
    ProductAsset: sequelize.import('../models/ProductAsset'),
    TakeoutAsset: sequelize.import('../models/TakeoutAsset')
}



models.sequelize = sequelize
models.Sequelize = Sequelize

    //selective syncing for development. when switching to migrations, remove this...
    //select the Model to run the sync on and then set the force setting to true. 
    //if setting up a completely new environment, comment out the association builder, create/sync the tables, and then allow the association builder.
models.selectiveSync = (cb) => {
    // models.User.sync({force: true})
    // models.Asset.sync({force: true})
    // models.Category.sync({force: true})
    // models.Takeout.sync({force: true})
    // models.Product.sync({force: true})
    // models.ProductAsset.sync({force: true})
    // models.TakeoutAsset.sync({force: true})
    return cb
}

//Association builder
Object.keys(models).forEach((modelName) =>{
    if('associate' in models[modelName]) {
        models[modelName].associate(models)
    }
})

module.exports = models
