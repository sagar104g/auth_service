var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var salt = bcrypt.genSaltSync(config.saltRounds);
// var hash = bcrypt.hashSync(myPlaintextPassword, salt);
var signOptions = {
    expiresIn: config.jwt_expire_time,
    algorithm: "RS512"   // RSASSA [ "HS256", "RS256", "RS384", "RS512" ]
};
var path = require('path')
var fs = require('fs')
var keys = [] //keys[0] == jwtPrivate key, keys[1] == jwtPublic key
var secretPromise = [];

var makeHash = function (password, cb) {
    bcrypt.hash(password, salt, function (err, hash) {
        if (err) {
            cb(err)
        } else {
            cb(null, hash)
        }
    });
}
exports.makeHash = makeHash;

var compareHash = function (password, hash, cb) {
    bcrypt.compare(password, hash, function (res) {
        if (res) {
            cb(null, res)
        } else {
            cb(true, res)
        }
    });
}
exports.compareHash = compareHash

var tokenCreator = function (payLoad, cb) {

    jwt.sign(payLoad, keys[0], signOptions, function (err, token) {
        if (err) {
            cb(err)
        } else {
            cb(null, token)
        }
    });
}
exports.tokenCreator = tokenCreator;

var tokenVerify = function (token, cb) {

    jwt.verify(token, keys[1], function (err, decoded) {
        if (err) {
            cb(err)
        } else {
            cb(null, decoded)
        }
    });
}
exports.tokenVerify = tokenVerify;

var readFile = function (fileName, cb) {
    // var fileName = '../config/'+indexName+'_setting.json';
    fs.readFile(path.join(__dirname, fileName), 'utf8', function (err, file) {
        if (err) {
            cb(err)
        } else {
            cb(null, file)
        }
    })
}
exports.readFile = readFile;

for (file in config.security_files) {
    secretPromise.push(new Promise(function (resolve, reject) {
        var fileName = '../config/' + config.security_files[file];
        readFile(fileName, function (err, fileData) {
            if (err) {
                reject(err)
            } else {
                console.log("read file " + config.security_files[file]);
                keys.push(fileData)
                resolve()
            }
        })
    })
    )
}
exports.secretPromise = secretPromise