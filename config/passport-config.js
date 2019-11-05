const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById){
    const authenticateUser = async (email, password, done) => {
        //find the user, will need to be modified to find user via database
        const user = getUserByEmail(email)
        //a user does not exist with that given email
        if (user == null){
            return done(null, false, { message: 'No user found with that email' })
        }

        try {
            if (await bcrypt.compare(password, user.password)){
                //success, returning user record
                return done(null, user)
            } else {
                //password failure
                return done(null, false, { message: 'Incorrect password' })
            }
        } catch (err) {
            return done(err)
        }

    }

    passport.use(new LocalStrategy({ usernameField: 'email', }, authenticateUser))
    //stores user in session
    passport.serializeUser((user, done) => done(null, user.id))
    //removes user from session
    passport.deserializeUser((id, done) => { 
        return done(null, getUserById(id))
    })
}

module.exports = initialize