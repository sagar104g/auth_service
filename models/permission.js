var acls = require('./acls');
var mongo = require('../utility/mongoQueries');
var config = require('../config/config');
var util = require('../utility/util')

var getRole = function (options, aclRoles, cb) {
    var userRoles = []
    userRoles.push("$public")
    if (aclRoles.indexOf("$public") != -1) {
        return cb(null, userRoles)
    }
    getUserId(options.token, function (err, userResult) {
        if (err) {
            return cb(err)
        } else {
            var userId = userResult.user_id;
            if (userId != '-1') {
                userRoles.push("$authenticated")
                if (aclRoles.indexOf("$authenticated") != -1) {
                    return cb(null, userRoles)
                }
                getStaticRole(userId, function (err, result) {
                    if (err) {
                        return cb(err)
                    } else {
                        if (result) {
                            for (var role in result) {
                                if (result[role]) {
                                    userRoles.push(result[role])
                                    if (aclRoles.indexOf(result[role]) != -1) {
                                        return cb(null, userRoles)
                                    }
                                }
                            }
                        }
                        checkOwnerRole(userId, OwnerId, function (err, result) {
                            if (err) {
                                return cb(err)
                            } else {
                                if (result) {
                                    userRoles.push("$self")
                                    if (aclRoles.indexOf("$self") != -1) {
                                        return cb(null, userRoles)
                                    }
                                }
                                getRolesFromUserModel(userId, function (err, result) {
                                    if (err) {
                                        return cb(err)
                                    } else {
                                        if (result) {
                                            userRoles.push(result)
                                        }
                                        return cb(null, userRoles)
                                    }
                                })
                            }
                        })
                    }
                })
            } else {
                return cb(null, userRoles)
            }
        }
    })

}
exports.getRole = getRole

var getRolesFromUserModel = function (userId, cb) {
    let queryObj = { "user_id": userId, "active": 1 }
    mongo.findOne(config.mainDb, 'users', queryObj, function (err, result) {
        if (err) {
            cb(err)
        } else {
            if (result && result.influencer && result.influencer == 2) {
                cb(null, '$influencer')
            } else {
                if (result && result.influencer && (result.influencer == 1 || result.influencer == 0)) {
                    cb(null, '$user')
                } else {
                    cb({ 'error': 'no user Found' })
                }
            }
        }
    })
}
exports.getRolesFromUserModel = getRolesFromUserModel

var checkOwnerRole = function (userId, OwnerId, userRoles, cb) {
    if (OwnerId == userId) {
        cb(null, userRoles)
    } else {
        cb(null, userRoles)
    }
}
exports.checkOwnerRole = checkOwnerRole;

var getStaticRole = function (userId, cb) {
    var aggregateQuery = [{
        $lookup: {
            from: 'role',
            localField: 'roleId',
            foreignField: '_id',
            as: "joinOutput"
        }
    }, {
        $unwind: {
            path: "$joinOutput"
        }
    }, {
        $match: {
            $and: [{
                'user_id': userId
            }]
        }
    }];
    mongo.aggregate(config.authDb, 'role_mapping', aggregateQuery, function (err, result) {
        if (err) {
            cb(err)
        } else {
            if (result) {
                let roleArr = []
                for (let roleObj in result) {
                    if (result[roleObj] && result[roleObj].joinOutput && result[roleObj].joinOutput.roleName) {
                        roleArr.push(result[roleObj].joinOutput.roleName)
                    }
                }
                cb(null, roleArr)
            } else {
                cb(null, null)
            }
        }
    })
}
exports.getStaticRole = getStaticRole;

var getUserId = function (token, cb) {
    util.tokenVerify(token, function (err, result) {
        if (err) {
            console.log(err)
            cb({ "err": "some internal error occurred" })
        } else {
            cb(null, { "user_id": result.user_id })
        }
    })
}
exports.getUserId = getUserId;

var checkPermission = function (option, cb) {
    if (option.modelName) {
        getRoleFromModel(option, function (err, result) {
            if (err) {
                cb(err)
            } else {
                cb(null, result)
            }
        })
    } else {
        getRoleFromFunction(option, function (err, result) {
            if (err) {
                cb(err)
            } else {
                cb(null, result)
            }
        })
    }
}
exports.checkPermission = checkPermission

var getRoleFromFunction = function (option, cb) {
    acls.getFunctionAcl(option.functionName, option.serviceName, function (err, aclRoles) {
        if (err) {
            cb(err)
        } else {
            getRole(option, aclRoles, function (err, userRoles) {
                if (err) {
                    cb(err)
                } else {
                    let response = {
                        "allow": false,
                        "userRole": null
                    }
                    for (let role in userRoles) {
                        if (aclRoles && aclRoles.indexOf(userRoles[role]) != -1) {
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
exports.getRoleFromFunction = getRoleFromFunction

var getRoleFromModel = function (option, cb) {
    acls.getAcls(option.modelName, option.accessType, option.serviceName, function (err, aclRoles) {
        if (err) {
            cb(err)
        } else {
            var roles = [];
            for (var value in aclRoles) {
                roles.push(aclRoles[value].role)
            }
            getRole(option, roles, function (err, userRoles) {
                if (err) {
                    cb(err)
                } else {
                    let response = {
                        "allow": false,
                        "userRole": null
                    }
                    for (let role in userRoles) {
                        if (roles && roles.indexOf(userRoles[role]) != -1) {
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
exports.getRoleFromModel = getRoleFromModel;
