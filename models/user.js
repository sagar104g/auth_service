var mongoQuery = require('../utility/mongoQueries')
var util = require('../utility/util')
var config = require('../config/config')

var login = function(body, cb){

    if(body.username && body.password){    
        let findQuery = {'username':body.username}
        mongoQuery.findOne(config.mainDb, 'user', findQuery, function(err, result){
            if(err){
                cb(err)
            }else{
                if(result){
                    util.compareHash(body.password, result.password, function(result){
                        if(result){
                            var payLoad = {'username': body.username}
                            util.tokenCreator(payLoad, function(err, token){
                                if(err){
                                    cb(err)
                                }else{
                                    var insertObj = {
                                        "user": body.username,
                                        "token": token
                                    }
                                    mongoQuery.insertOne(config.authDb, 'access_token', insertObj, function(err , result){
                                        if(err){
                                            cb(err)
                                        }else{
                                            cb(null, token)
                                        }
                                    })
                                }
                            })
                        }else{
                            cb({'error': 'username or password is not matching'})
                        }
                    })
                }else{
                    cb({'error': 'username or password is not matching'})
                }
            }
        })
    }else{
        cb({'error': 'username or password missing'})
    }
}
exports.login = login;

var logout = function(token, cb){
    if(token){
        var deleteObj = {'token': token}
        mongoQuery.deleteOne(config.authDb, 'access_token', deleteObj, function(err, result){
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
