var mongoQuery = require('../utility/mongoQueries')
var util = require('../utility/util')

var login = function(body, cb){

    if(body.userName && body.password){    
        let findQuery = {'userName':body.userName}
        mongoQuery.findOne('fu-test-db', 'user', findQuery, function(err, result){
            if(err){
                cb(err)
            }else{
                if(result){
                    util.compareHash(body.password, result.password, function(result){
                        if(result){
                            var payLoad = {'userName': body.userName}
                            util.tokenCreator(payLoad, function(err, token){
                                if(err){
                                    cb(err)
                                }else{
                                    var insertObj = {
                                        "user": body.userName,
                                        "token": token
                                    }
                                    mongoQuery.insertOne('fu-test-db', 'accessToken', insertObj, function(err , result){
                                        if(err){
                                            cb(err)
                                        }else{
                                            cb(null, result)
                                        }
                                    })
                                }
                            })
                        }else{
                            cb({'error': 'userName or password is not matching'})
                        }
                    })
                }else{
                    cb({'error': 'userName or password is not matching'})
                }
            }
        })
    }else{
        cb({'error': 'userName or password missing'})
    }
}
exports.login = login;

var logout = function(token, cb){
    if(token){
        var deleteObj = {'token': token}
        mongoQuery.deleteOne('fu-test-db', 'accessToken', deleteObj, function(err, result){
            if(err){
                cb(err)
            }else{
                cb(null, result)
            }
        })
    }else{
        cb({"err":"accessToken missing"})
    }
}
exports.logout = logout;

var signup = function(body, cb){

    if(body.userName && body.password){
        util.makeHash(body.password, function(err, result){
            if(err){
                cb(err)
            }else{
                var insertObj = {
                    'userName': body.userName,
                    'password': result
                }
                mongoQuery.insertOne('fu-test-db', 'user', insertObj, function(err, result){
                    if(err){
                        cb(err)
                    }else{
                        cb(null, result)
                    }
                })
            }
        })
    }else{
        cb({"err":"userName or password missing"})
    }
}
exports.signup = signup;