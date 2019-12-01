var mongoQuery = require('../utility/mongoQueries')
var accessControlList = {}

var aclSetup = function(){
    var ready = new Promise(function(resolve, reject){
        var aggregateQuery = [{$lookup:{
            from: 'fu_acls',
            localField: '_id',
            foreignField: 'modelId',
            as: "joinOutput"
        } 
        }];
        mongoQuery.aggregate('fu-test-db', 'fu_model_config', aggregateQuery, function(err, result){
            if(err){
                reject()
                cb(err)
            }else{
                if(result){
                    
                    for(var aclIterator in result){
                        for(var joinOutputIterator in result[aclIterator].joinOutput){
                            acl = {
                                accessType: result[aclIterator].joinOutput[joinOutputIterator].accessType,
                                role: result[aclIterator].joinOutput[joinOutputIterator].roleName
                            }

                            if(accessControlList[result[aclIterator].modelName]){
                                accessControlList[result[aclIterator].modelName].acls.push(acl)
                            }else{
                                accessControlList[result[aclIterator].modelName] = {
                                    acls:[acl]
                                }
                            }
                        }
                        accessControlList[result[aclIterator].modelName].id = result[aclIterator]._id.toString()
                        accessControlList[result[aclIterator].modelName].baseModel = result[aclIterator].baseModel ? result[aclIterator].baseModel.toString() : result[aclIterator].baseModel
                        accessControlList[result[aclIterator].modelName].serviceName = result[aclIterator].serviceName
                    }
                    resolve()
                }else{
                    console.log("no acl found")
                    reject()
                }
            }
        })
    })
    return ready;
}
exports.aclSetup = aclSetup;

var aclFetcher = function(modelName, accessType, serviceName, acls){
    if(!modelName){
        return acls;
    }
    var acls = acls || []
    var list = accessControlList[modelName] ? (accessControlList[modelName].acls ? accessControlList[modelName].acls : []  ) : []
    if(accessControlList[modelName] && accessControlList[modelName].serviceName == serviceName){
        for(var acl in list){
            if(list[acl] && accessType.indexOf(list[acl].accessType) != -1){
                acls.push(list[acl])
            }
        }
    }
    let baseModel = null;
    for(var modelIterator in accessControlList){
        if(accessControlList[modelIterator].id === accessControlList[modelName].baseModel){
            baseModel = modelIterator;
            break;
        }
    }
    return accessControlList[modelName] ? aclFetcher(baseModel, accessType, serviceName, acls) : acls
    
}
exports.aclFetcher = aclFetcher

var getAcls = function(ModelName, accessType, serviceName, cb){
    var accessTypes = []
    if(accessType === 'READ'){
        accessTypes.push('READ')
        accessTypes.push('WRITE')
        accessTypes.push('*')
    }else{
        if(accessType === "WRITE"){
            accessTypes.push('WRITE')
            accessTypes.push('*')
        }else{
            accessTypes.push('*')
        }
    }
    var acls = aclFetcher(ModelName, accessTypes, serviceName)
    cb(null, acls) 
}
exports.getAcls = getAcls;