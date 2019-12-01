var mongo = require('mongodb').MongoClient;
var config = require('../config/config')

var mongoConnectionsPool ;
var mongoPromise = [];
var mongoPoolConnection = function(){
	var ready = new Promise(function(resolve, reject){
		var url = config.mongo.connectionString;
		mongo.connect(url, {useUnifiedTopology: true}, {
			poolSize: 10
		}, function(err, db){
			if(err){
				reject(err);
			} else{
				mongoConnectionsPool = db;
				resolve();
			}
		})
	})
	return ready;
}
exports.mongoPoolConnection = mongoPoolConnection

exports.getMongoConnection = function(name){
	return mongoConnectionsPool.db(mongoConnectionsPool.s.options.dbName);
}