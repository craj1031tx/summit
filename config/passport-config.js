const LocalStrategy = require('passport-local').Strategy
const Models = require('../config/database')
const bcrypt = require('bcrypt')


module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
            //Match User
            Models.User.findAll({
                limit: 1,
                where: {
                    email: email
                }
            })
                .then(singleUser => {
                    //Email is not registered
                    if(singleUser.length==0){
                        return done(null, false, { message: 'That email is not registered'}); //TODO revert this to a more generic error for production - error messages might be broken due to switch from express-flash to connect-flash
                    }
                    //Email has not been verified (emailVerified is set to False, reject login)
                    if(!singleUser[0].emailVerified){
                        console.log('in the email is not verified if block')
                        return done(null, false, { message: 'Please verify your email first'});
                    }
                    //Matching the password
                    bcrypt.compare(password, singleUser[0].password, (err, isMatch) => {
                        if(err) {
                            throw err
                        }
                        if(isMatch){
                            return done(null, singleUser[0]);
                        } else {
                            return done(null, false, { message: 'The password is incorrect'})  //TODO revert this to a more generic error for production - error messages might be broken due to switch from express-flash to connect-flash
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
        Models.User.findAll({
            limit: 1,
            where: { id: id }
        })
            .then(user => {
                done(null, user[0])
            })
            .error(err => done(err, null))
    })
}
