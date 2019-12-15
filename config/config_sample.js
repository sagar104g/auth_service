var config = {
	"mongo_fu-test-db": {
		username: 'test',
		password: 'test',
		hosts: 'localhost',
		replicaSet: 'replSetName',
		database: 'dbName'
	},
	"mongo_main": {
		username: 'test',
		password: 'test',
		hosts: 'localhost',
		replicaSet: 'replSetName',
		database: 'dbName'
	},
	"authDb": 'dbName',
	"mainDb": 'dbName',
    SENTRY_DSN: 'https://c708079d53934185998ed7c755bc6212@sentry.io/1813565'
};

module.exports = config;