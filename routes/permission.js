var express = require('express');
var router = express.Router();
var permission = require('../models/permission')

router.post('/check_role', function (req, res) {

    var options = {
        ownerId: req.body.ownerId,
        modelName: req.body.modelName,
        customFunction: req.body.customFunction,
        token: req.headers.authorization,
        accessType: req.body.accessType,
        serviceName: req.body.serviceName
    }
    if (req.body.serviceName && req.headers.authorization) {
        permission.checkPermission(options, function (err, result) {
            if (err) {
                console.log(err)
                res.status(500)
                res.json({ "allow": false, "userRole": null })
            } else {
                res.status(200)
                res.json(result)
            }
        })
    }
})
module.exports = router;
