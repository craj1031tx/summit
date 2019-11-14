const Sequelize = require('sequelize');

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

sequelize.authenticate()
    .then(() => console.log("Database connected..."))
    .catch(err => console.log("Error: " + err))

const models = {
    User: sequelize.import('../models/Users'),
    Category: sequelize.import('../models/Categories'),
    Product: sequelize.import('../models/Products'),
    Asset: sequelize.import('../models/Assets'),
    Takeout: sequelize.import('../models/Takeouts'),
}



models.sequelize = sequelize
models.Sequelize = Sequelize

    //selective syncing for development. when switching to migrations, remove this...
    //select the Model to run the sync on and then set the force setting to true. 
models.selectiveSync = (cb) => {
    //models.Takeout.sync({force: false})
    return cb
}

Object.keys(models).forEach((modelName) =>{
    if('associate' in models[modelName]) {
        models[modelName].associate(models)
    }
})

module.exports = models
