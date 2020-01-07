var mongoService = require('../services/mongo')

var findOne = function (dbName, collectionName, query, cb) {

    var db = mongoService.getMongoConnection(dbName)
    // var query = {_id: id}
    db.collection(collectionName).findOne({
        $and: [query]
    }, function (err, doc) {
        if (err) {
            cb(err)
        } else {
            if (doc) {
                cb(null, doc)
            } else {
                cb(null, null)
            }
        }
    })
}
exports.findOne = findOne

var insertOne = function (dbName, collectionName, insertObject, cb) {

    var db = mongoService.getMongoConnection(dbName)
    db.collection(collectionName).insertOne(insertObject, function (err, res) {
        if (err) {
            cb(err)
        } else {
            cb(null, res)
        }
    });
}
exports.insertOne = insertOne



var updateOne = function (dbName, collectionName, findQuery, updateValue, cb) {

    var db = mongoService.getMongoConnection(dbName)
    // var myquery = { address: "Valley 345" };
    // var newvalues = { $set: {name: "Mickey", address: "Canyon 123" } };
    db.collection(collectionName).updateOne(findQuery, updateValue, function (err, res) {
        if (err) {
            cb(err)
        } else {
            cb(null, res)
        }
    });
}
exports.updateOne = updateOne

var deleteOne = function (dbName, collectionName, deleteQuery, cb) {

    var db = mongoService.getMongoConnection(dbName)
    // var deleteObj = { token: 'Mountain 21' };
    db.collection(collectionName).deleteOne(deleteQuery, function (err, result) {
        if (err) {
            cb(err)
        } else {
            cb(null, result)
        }
    });
}
exports.deleteOne = deleteOne

var aggregate = function (dbName, collectionName, aggregateQuery, cb) {
    var db = mongoService.getMongoConnection(dbName)
    // { $lookup:
    //     {
    //       from: 'products',
    //       localField: 'product_id',
    //       foreignField: '_id',
    //       as: 'orderdetails'
    //     }
    //   }
    db.collection(collectionName).aggregate(aggregateQuery).toArray(function (err, result) {
        if (err) {
            cb(err)
        } else {
            if (result) {
                cb(null, result)
            } else {
                cb(null, null)
            }
        }
    });
}
exports.aggregate = aggregate;