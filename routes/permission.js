var express = require('express');
var router = express.Router();
var permission = require('../models/permission')

router.post('/check_role', function(req, res){

    var options = {
        ownderId : req.body.ownerId,
        modelName : req.body.modelName,
        customFunction : req.body.customFunction,
        token : req.headers.authorization,
        accessType: req.body.accessType,
        serviceName: req.body.serviceName
    }
    permission.checkPermission(options, function(err, result){
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
