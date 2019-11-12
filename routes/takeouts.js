const express = require('express')
const router = express.Router()
const Models = require('../config/database')
const auth = require('../config/authenticate')
const multerEngine = require('../config/multerEngine')
const crypto = require('crypto')    //creates random string to store files



router.get('/newtakeout', (req, res) => {
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

router.post('/takeouts/add_to_takeout/:asset_id', (req, res) => {
    //check to see if the user has a currently existing takeout builder in his session. If not, create a new array and start to push asset ids into it
    if (!req.session.newUserTakeout){
        req.session.newUserTakeout = []
        req.session.newUserTakeout.push(req.params.asset_id)
    } else {
        req.session.newUserTakeout.push(req.params.asset_id)
    }
    res.redirect('/newtakeout')
})

router.post('/takeouts/create_new_takeout', (req, res) => {
    if(req.session.newUserTakeout){
        var futureExpiration = new Date()
        futureExpiration.setDate(futureExpiration.getDate() + 10)
        crypto.pseudoRandomBytes(3, (err, raw) => {
            var takeoutToken = raw.toString('hex');
            console.log('inside the block' + takeoutToken)
            Models.Takeout.create({
                token: takeoutToken,
                takeoutAssets: req.session.newUserTakeout,
                isActive: true,
                expiration: futureExpiration,
                userId: req.session.userId
            })
            .then((results) => {
                //reset the users newUserTakeout builder to an empty array and redirect the user to the view for that takeout. 
                req.session.newUserTakeout = [];    
                res.redirect('/retrieve_takeout/?token='+results.token)
            })
            .catch((err) => console.log(err))
        });
    } else {
        res.redirect('/categories')
    }    
})

router.get('/retrieve_takeout', (req,res) => {
    Models.Takeout.findOne({
        where: {
            token: req.query.token
        }
    })
        .then((results) => {
            //there are no results, redirect back to landing page
            if(!results) {
                return res.redirect('/')
            }
            //there are results (found a token match), proceed with querying token and displaying all assets. 
            Models.Asset.findAll({
                where: {
                    id: results.takeoutAssets
                }
            })
                .then((assetResults) => {
                    res.render('takeouts/takeoutViewer', {assets: assetResults, takeoutToken: req.query.token})
                })
                .catch((err) => {
                    console.log(err)
                    res.redirect('/')
                })
        })
        .catch((err) => {
            console.log(err)
            res.redirect('/')
        })
})



module.exports = router;