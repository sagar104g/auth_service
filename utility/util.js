var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
var saltRounds = 5;
var salt = bcrypt.genSaltSync(saltRounds);
// var hash = bcrypt.hashSync(myPlaintextPassword, salt);
var signOptions = {
    expiresIn:  "15d",
    algorithm:  "HS256"   // RSASSA [ "RS256", "RS384", "RS512" ]
   };
var secret = 'secret';

var makeHash = function(password, cb){
bcrypt.hash(password, salt, function(err, hash) {
    if(err){
        cb(err)
    }else{
        cb(null, hash)
    }
  });
}
exports.makeHash = makeHash;

var compareHash = function(password, hash, cb){
    bcrypt.compare(password, hash, function(res) {
        if(res){
            cb(null, res)
        }else{
            cb(true, res)
        }
    });
}
exports.compareHash = compareHash

var tokenCreator = function(payLoad, cb){

    jwt.sign(payLoad, secret, signOptions, function(err, token) {
        if(err){
            cb(err)
        }else{
            cb(null, token)
        }
    });
}
exports.tokenCreator = tokenCreator;

var tokenVerify = function(token, cb){

    jwt.verify(token, secret, function(err, decoded) {
        if(err){
            cb(err)
        }else{
            cb(null, decoded)
        }
    });
}
exports.tokenVerify = tokenVerify;