
module.exports = (sequelize, Datatypes) => {
    const User = sequelize.define('user', {
            name: {
                type: Datatypes.STRING,        
            },
            email: {
                type: Datatypes.STRING
            },
            password: {
                type: Datatypes.STRING
            },
            userLevel: {
                type: Datatypes.INTEGER
            }
    })

    return User;
}