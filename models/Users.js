const Sequelize = require('sequelize')
const db = require('../config/database')

const User = db.define('user', {
    name: {
        type: Sequelize.STRING,        
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    userLevel: {
        type: Sequelize.INTEGER
    }
})


//User.sync with the force setting as true will drop the User table ever time this is run. 
User.sync({ force: false })

// User.findAll().then(users => {
//     console.log("All users:", JSON.stringify(users, null, 4));
// });

module.exports = User;