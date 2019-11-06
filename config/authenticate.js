var aunthenticate = {
    //check user authentication. if authenticated, then proceed to next function. if not, then redirect to login.
    isAuth: function(req, res, next){
        if (req.isAuthenticated()) {
            return next()
        } 

        res.redirect('/users/login')
    },
    //protect already logged in users from visiting login or register pages
    alreadyAuth: function(req, res, next){
        if (req.isAuthenticated()) {
            return res.redirect('/')
        }
        next()
    }

}

module.exports = aunthenticate
