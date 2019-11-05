var aunthenticate = {
    //check user authentication. if authenticated, then proceed to next function. if not, then redirect to login.
    checkAuthenticated: function(req, res, next){
        if (req.isAuthenticated()) {
            return next()
        } 

        res.redirect('/login')
    },
    //check if a user isn't authenticated. if they are already registered, they shouldn't be able to see some screens (such as login and register screens), so take them back to the homepage.
    checkNotAuthenticated: function(req, res, next){
        if (req.isAuthenticated()) {
            return res.redirect('/')
        }
        next()
    }

}

module.exports = aunthenticate
