// const Sentry = require('@sentry/node');
// Sentry.init({ dsn: 'https://c708079d53934185998ed7c755bc6212@sentry.io/1813565' });
const express = require('express')
const app = express()
var mongoPromise = require('./services/mongo')
var aclsPromise = require('./models/acls')
var user = require('./routes/user')
var permission = require('./routes/permission')
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// bootFilePromises = bootFile.map(function(name){
//   var promise = require(name).ready
//   return promise;
// })

app.use('/permission', permission)
app.use('/user', user)

mongoPromise.mongoPoolConnection().then( function(){
  aclsPromise.aclSetup()
}).then( function(){
  app.listen(4000, function () {
    console.info("Server is running on 4000 port");
  });
}).catch(function(err){
  console.log(err)
})