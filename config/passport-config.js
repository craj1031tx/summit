const LocalStrategy = require('passport-local').Strategy
const User = require('../models/Users')
const bcrypt = require('bcrypt')


module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
            console.log("the passed email is: ", email)
            //Match User
            User.findAll({
                limit: 1,
                where: {
                    email: email
                }
            })
                .then(singleUser => {
                    if(singleUser.length==0){
                        return done(null, false, { message: 'the user is not registered'}); 
                    }
                    //Matching the password
                    bcrypt.compare(password, singleUser[0].password, (err, isMatch) => {
                        if(err) {
                            throw err
                        }
                        if(isMatch){
                            return done(null, singleUser[0]);
                        } else {
                            return done(null, false, { message: 'the passwords do not match'})
                        }
                    })
                })
                .catch(err => console.log(err))
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findAll({
            limit: 1,
            where: { id: id }
        })
            .then(user => {
                done(null, user[0])
            })
            .error(err => done(err, null))
    })
}
