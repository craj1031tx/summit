const Sequelize = require('sequelize');

//database connection, using sequelize and postgrest. pool size may need to be modified for production
module.exports = new Sequelize('summit', 'postgres', process.env.POSTGRES_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
  pool: { 
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});