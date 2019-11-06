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
        console.log('the user id to deserialize is: ' + id)
        User.findAll({
            limit: 1,
            where: { id: id }
        })
            .then(user => {
                console.log('the deserialized user is: ' + JSON.stringify(user[0], null, 4))
                done(null, user[0])
            })
            .error(err => done(err, null))
    })
}
