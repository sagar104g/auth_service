var acls = require('./acls');
var mongo = require('../utility/mongoQueries');

var getRole = function(token, cb){
    var userRoles =  []
    userRoles.push("$public")
    if(userRoles.indexOf("$public") != -1){
        return cb(null, userRoles)
    }
    getUserId(token, userRoles, function(err, userId){
        if(err){
            return cb(err)
        }else{
            if(userId != -1){
                userRoles.push("$authenticated")
                if(userRoles.indexOf("$authenticated") != -1){
                    return cb(null, userRoles)
                }
                getStaticRole(userId, function(err, result){
                    if(err){
                        return cb(err)
                    }else{
                        if(result){
                            for(var role in result){
                                if(result[role] && result[role].joinOutput && result[role].joinOutput.roleName){
                                    userRoles.push(result[role].joinOutput.roleName)
                                    if(userRoles.indexOf(result[role].joinOutput.roleName) != -1){
                                        return cb(null, userRoles)
                                    }
                                }
                            }
                        }
                        checkOwnerRole(userId, OwnerId, function(err, result){
                            if(err){
                                return cb(err)
                            }else{
                                if(result){
                                    userRoles.push("$self")
                                }else{
                                    return cb(null, userRoles)
                                }
                                getRolesFromUserModel(userId, function(err, result){
                                    if(err){
                                        return cb(err)
                                    }else{
                                        if(result){
                                            userRoles.push(result)
                                        }
                                            return cb(null, userRoles)
                                    }
                                })
                            }
                        })
                    }
                })
            }else{
                return cb(null, userRoles)
            }
        }
    })

}
exports.getRole = getRole

var getRolesFromUserModel = function(userId, cb){
    let queryObj = {"userId" : userId, "active": 1}
    mongo.findOne('fu-test-db', 'user',queryObj, function(err, result){
        if(err){
            cb(err)
        }else{
            if(result && result.designation){
                cb(null, result.designation)
            }else{
                cb({'error':'no user Found'})
            }
        }
    })
}
exports.getRolesFromUserModel = getRolesFromUserModel

var checkOwnerRole = function(userId, OwnerId, userRoles, cb){
    if(OwnerId == userId){
        cb(null, userRoles)
    }else{
        cb(null, userRoles)
    }
}
exports.checkOwnerRole = checkOwnerRole;

var getStaticRole = function(userId, cb){
    var aggregateQuery = [{$lookup:{
                 from: 'role',
                 localField: 'roleId',
                 foreignField: '_id',
                 as: "joinOutput"
             } 
             },{$match:{
                 $and :[{
                         'userId': userId
                       }]
               }
     }];
     mongo.aggregate('fu-test-db', 'role_mapping', aggregateQuery, function(err, result){
         if(err){
             cb(err)
         }else{
            if(result){
                cb(null, result)
            }else{
                cb(null, null)
            }
         }
     })
}
exports.getStaticRole = getStaticRole;

var getUserId = function(token, userRoles, cb){
    let queryObj = {"token" : token}
    mongo.findOne('fu-test-db', 'accessToken',queryObj, function(err, result){
        if(err){
            cb(err)
        }else{
            if(result){
                cb(null, userRoles)
            }else{
                cb({'error':'no user Found'})
            }
        }
    })
}
exports.getUserId = getUserId;

var checkPermission = function(option, cb){
    acls.getAcls(option.modelName, option.accessType, option.serviceName, function(err, aclRoles){
        if(err){
            cb(err)
        }else{
            getRole(option, aclRoles, function(err, userRoles){
                if(err){
                    cb(err)
                }else{
                    let response = {
                        "allow": false,
                        "userRole": null          
                    }
                    for(let role in userRoles){
                        if(aclRoles && aclRoles.indexOf(userRoles[role]) != -1){
                            response.allow = true;
                            response.userRole = userRoles[role];
                            break;
                        }
                    }
                    cb(null, response)
                }
            })
        }
    })
}
exports.checkPermission = checkPermission