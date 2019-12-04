const express = require('express')
const router = express.Router()
const auth = require('../config/authenticate')
const Models = require('../config/database')


router.get('/admin', auth.isAdmin, (req, res) => {
    res.render('admins/admin')
})


router.get('/admin/users/', auth.isAdmin, (req, res) => {
    Models.User.findAll().then(users => {
        res.render('admins/allUsers', {users: users});
      });
})

//Toggle the adminVerified record for a user. 
router.get('/admin/users/toggle_admin_verified/:userId', auth.isAdmin, (req, res) => {
    Models.User.findOne({where: {id: req.params.userId}})
    .then((user) => {
        //if no user found, then redirect to homepage. 
        if(!user) {return res.redirect('/')}
        user.adminVerified = !user.adminVerified
        user.save()
        .then(() => res.redirect('/admin/users'))
        .catch((err) => {
            req.flash('error_msg', 'There was an error updating the adminVerified field' + err)
            res.redirect('/admin/users')
        })
    })
})

//Toggle to emailVerified record for a user. This should rarely be done by an admin.
router.get('/admin/users/toggle_email_verified/:userId', auth.isAdmin, (req, res) => {
    Models.User.findOne({where: {id: req.params.userId}})
    .then((user) => {
        //if no user found, then redirect to homepage. 
        if(!user) {return res.redirect('/')}
        user.emailVerified = !user.emailVerified
        user.save()
        .then(() => res.redirect('/admin/users'))
        .catch((err) => {
            req.flash('error_msg', 'There was an error updating the emailVerified field' + err)
            res.redirect('/admin/users')
        })
    })
    .catch((err) => console.log(err))
})

module.exports = router;