var express = require('express');
var router = express.Router();
var user = require('../models/user')

router.post('/login', function (req, res) {
    user.login(req.body, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500)
            res.json({ "err": "some error happend" })
        } else {
            res.status(200)
            res.json(result)
        }
    })
})

router.post('/logout', function (req, res) {
    user.logout(req.headers.authorization, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500)
            res.json({ "error": "some error happend" })
        } else {
            res.status(200)
            res.json({ "message": "you have been logged out" })
        }
    })
})

router.post('/getUserId', function (req, res) {
    user.getUserIdFromToken(req.headers.authorization, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500)
            res.json({ "error": "some error happend" })
        } else {
            res.status(200)
            res.json(result)
        }
    })
})

module.exports = router;
