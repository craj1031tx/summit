const express = require('express')
const router = express.Router()
const Models = require('../config/database')
const auth = require('../config/authenticate')
const crypto = require('crypto')    //creates random string to store files


//route for a user to view all of their past takeouts in one place. 
router.get('/takeouts/my_takeouts', (req, res) => {
    Models.Takeout.findAll({
        where: {
            userId: req.user.id
        },
        include: [{
            model: Models.Asset,
            as: 'assets'
        }]
    })
        .then((allTakeouts) => {
            if(allTakeouts.length){
                return res.render('takeouts/myTakeouts', {takeouts: allTakeouts})//res.send(allTakeouts)
            }
        req.flash('success_msg', 'You do not have any takeouts to inspect.')
        res.redirect('/categories')
        })
        .catch((err) => {
            res.send(err)
        })
})

//Allows a user to inspect their currently being built takeout. If the newUserTakeout session array is empty, then redirect to the categories page so that they can build. If the search returns empty for some reason, also redirect to category.
router.get('/takeouts/new_takeout', (req, res) => {
    if(!req.session.newUserTakeout){ 
        req.flash('success_msg', 'You currently do not have a takeout under construction.')
        res.redirect('/categories')
        return
    }
    //find all assets that are stored in a user's newUserTakeout session, if it exists. if not, catch error below and redirect to categories page. 
    Models.Asset.findAll({
        where: {
            id: req.session.newUserTakeout
        }
    })
    .then((assets) => res.render('takeouts/takeoutBuilder', {assets: assets}))
    .catch((err) => {
        //if there is no newUserTakeout in the session, then log error in the console and redirect the user back to the category level
        console.log(err)
        res.redirect('/categories')
    })
})

//Stores a new asset it in a users session. This is meant to be a temporary space to store a new takeout that a user is building so that the database doesn't have to
router.post('/takeouts/add_to_takeout/:asset_id', (req, res) => {
    //check to see if the user has a currently existing takeout builder in his session. If not, create a new array and start to push asset ids into it
    if(!req.session.newUserTakeout){
        req.session.newUserTakeout = []
        req.session.newUserTakeout.push(req.params.asset_id)
    } else {
        req.session.newUserTakeout.push(req.params.asset_id)
    }
    res.redirect('/takeouts/new_takeout')
})

router.get('/takeouts/remove_from_takeout/:asset_id', (req, res) => {
    if(req.session.newUserTakeout){
        var itemToRemove = req.params.asset_id
        var oldArr = req.session.newUserTakeout
        var newArr = oldArr.filter((temp) => temp !== itemToRemove)
        req.session.newUserTakeout = newArr //TODO try refactoring this down so that
        if(newArr.length === 0) {
            req.session.newUserTakeout = undefined
        }
        res.redirect('/takeouts/new_takeout')
        return
    }
    res.redirect('/categories')
})


//Takeout creator route that coallates the individual assets stored in a users session into a single takeout, with the asset ids stores in the 'takeoutAssets' column of the row. 
router.post('/takeouts/create_new_takeout', (req, res) => {
    if(req.session.newUserTakeout){
        var futureExpiration = new Date()
        futureExpiration.setDate(futureExpiration.getDate() + 10)
        crypto.pseudoRandomBytes(3, (err, raw) => {
            var takeoutToken = raw.toString('hex');
            console.log('inside the block' + takeoutToken)
            Models.Takeout.create({
                token: takeoutToken,
                takeoutAssets: [],//req.session.newUserTakeout, TODO: can be removed
                isActive: true,
                expiration: futureExpiration,
                userId: req.user.id
            })
            .then((savedTakeout) => {
                req.session.newUserTakeout.forEach(function(assetId) {
                    Models.Asset.findOne({where: {id: assetId} })
                    .then((foundAsset) => savedTakeout.addAsset(foundAsset))
                })

                //reset the users newUserTakeout builder to an empty array and redirect the user to the view for that takeout. 
                req.session.newUserTakeout = [];    
                res.redirect('/takeouts/retrieve_takeout/?token='+savedTakeout.token)
            })
            .catch((err) => console.log(err))
        });
    } else {
        res.redirect('/categories')
    }    
})

//route to retrieve a takeout with a token. 
router.get('/takeouts/retrieve_takeout', (req,res) => {
    Models.Takeout.findOne({
        where: {
            token: req.query.token
        },
        include: [{
            model: Models.Asset,
            as: 'assets'
        }]
    })
        .then((results) => {
            //there are no results, redirect back to landing page
            if(!results) {
                req.flash('error_msg', "That token does not exist or is no longer valid.")
                return res.redirect('/')
            }
            //there are results (found a token match), proceed with querying token and displaying all assets. 
            res.render('takeouts/takeoutViewer', {takeout: results})
        })
        .catch((err) => {
            console.log(err)
            res.redirect('/')
        })
})



module.exports = router;