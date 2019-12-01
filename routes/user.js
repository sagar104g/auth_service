var express = require('express');
var router = express.Router();
var user = require('../models/user')

router.post('/login', function(req, res){
    user.login(req.body, function(err, result){
        if(err){
            res.status(500)
            res.json({"error":"some error happend"})
        }else{
            res.status(200)
            res.json(result)
        }
    })
})

router.post('/logout', function(req, res){
    user.logout(req.body, function(err, result){
        if(err){
            res.status(500)
            res.json({"error":"some error happend"})
        }else{
            res.status(200)
            res.json(result)
        }
    })
})

router.post('/signup', function(req, res){
    user.signup(req.body, function(err, result){
        if(err){
            res.status(500)
            res.json({"error":"some error happend"})
        }else{
            res.status(200)
            res.json(result)
        }
    })
})

module.exports = router;