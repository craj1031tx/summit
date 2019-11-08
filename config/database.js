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
}

Object.keys(models).forEach((modelName) =>{
  if('associate' in models[modelName]) {
    console.log('running inside of this block and currently association the following model: ', models)
    models[modelName].associate(models)
  }
})

models.sequelize = sequelize
models.Sequelize = Sequelize

module.exports = models
