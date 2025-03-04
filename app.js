const Sentry = require('@sentry/node');
const express = require('express')
const app = express()
var mongoConnection = require('./services/mongo')
var aclsPromise = require('./models/acls')
var user = require('./routes/user')
var permission = require('./routes/permission')
var bodyParser = require('body-parser')
var config = require('./config/config')
var utils = require('./utility/util')

Sentry.init({ dsn: config.SENTRY_DSN });
app.use(Sentry.Handlers.requestHandler());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/permission', permission)
app.use('/user', user)
app.get('/status', function (req, res) {
  res.json({ "status": "ok" })
})

app.use(Sentry.Handlers.errorHandler());
app.use(function onError(err, req, res, next) {
  res.end(res.sentry + "\n");
  console.log("Error Handled Via Sentry: " + res.sentry)
  next();
});
Promise.all(mongoConnection.mongoPromise).then(function () {
  aclsPromise.aclSetup()
}).then(function () {
  Promise.all(utils.secretPromise)
}).then(function () {
  app.listen(4000, function () {
    console.info("Server is running on 4000 port");
  });
}).catch(function (err) {
  console.log(err)
})
