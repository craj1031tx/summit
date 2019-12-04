module.exports = (sequelize, Datatypes) => {
    const User = sequelize.define('user', {
            firstName: {
                type: Datatypes.STRING,
                validate: {
                    is: { 
                        args: ["^[a-z]+$",'i'],
                        msg: "Please enter a first name with only alphabetical values."
                    }
                }        
            },
            lastName: {
                type: Datatypes.STRING,
                validate: {
                    is: { 
                        args: ["^[a-z]+$",'i'],
                        msg: "Please enter a last name with only alphabetical values."
                    }
                }    
            },
            email: {
                type: Datatypes.STRING,
                validate: {
                    isEmail: {msg: 'Please enter a valid email address'},
                }    
            },
            password: { //validation for the password field should only be occuring on a bcrypt password, so the users plaintext password needs to be validated in the controller before encryption.
                type: Datatypes.STRING
            },
            userLevel: {
                type: Datatypes.INTEGER,
                defaultValue: 1
            },
            isAdmin: {
                type: Datatypes.BOOLEAN,
                defaultValue: false
            },
            emailVerified: {
                type: Datatypes.BOOLEAN,
                defaultValue: false
            },
            adminVerified: {
                type: Datatypes.BOOLEAN,
                defaultValue: false
            },
            emailVerificationHash: {
                type: Datatypes.TEXT    //generated when a user first signs up with a crypto
            },
    })

    User.associate = (models) => {
        User.hasMany(models.Takeout, {as: 'takeouts', foreignKey: 'userId'})
    }

    return User;
}