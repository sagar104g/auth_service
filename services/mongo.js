var mongo = require('mongodb').MongoClient;
var config = require('../config/config')

var mongoConnectionsPool = {};
var mongoPromise = [];

for (dbName in config) {
	if (dbName.indexOf('mongo_') == 0) {
		mongoPromise.push(new Promise(function (resolve, reject) {
			//mongodb://test:try@localhost/fu-test-db?replicaSet=fu_test   password
			var url = config[dbName].starter + '://' + config[dbName].username + ':' + config[dbName].password + '@' + config[dbName].hosts + '/' + config[dbName].database + '?replicaSet=' + config[dbName].replicaSet;
			var name = dbName.split('mongo_')[1];
			mongo.connect(url, { useUnifiedTopology: true }, {
				poolSize: 10
			}, function (err, db) {
				if (err) {
					reject(err);
				} else {
					mongoConnectionsPool[name] = db;
					console.log('connection setup with ' + name)
					resolve();
				}
			})
		})
		)
	}
}

exports.mongoPromise = mongoPromise

exports.getMongoConnection = function (name) {
	return mongoConnectionsPool[name].db(mongoConnectionsPool[name].s.options.dbName);
}
