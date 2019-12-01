var acls = require('./acls');
var mongo = require('../utility/mongoQueries');

var getOwnerRole = function(userId, cb){
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
                cb(result)
            }else{
                cb(null, null)
            }
         }
     })
}
exports.getOwnerRole = getOwnerRole;

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
                cb(result)
            }else{
                cb(null, null)
            }
         }
     })
}
exports.getStaticRole = getStaticRole;

var getUserId = function(token){
    let queryObj = {"token" : token}
    mongo.findOne('fu-test-db', 'accessToken',queryObj, function(err, result){
        if(err){
            cb(err)
        }else{
            if(result){
                cb(null, result)
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