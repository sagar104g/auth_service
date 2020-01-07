var util = require('util');
var winston = require('winston');
var utility = require('../utility/utility');
var moduleName = 'Cerebro';
const path = require('path');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: function () {
        return utility.formatDate(new Date(), 'long_date_with_time');
      },
      formatter: function (options) {
        return options.timestamp() + ' : ' + '[' + moduleName + ']' + ' : ' +
          options.level + ' : ' + (options.message ? options.message.replace(/[\r\n]+/gm, "") : '');
      },
      colorize: true
    })
  ]
});

var log = console.log;

console.log = function () {
  logger.info(getFileInfo() + ' : ' + util.format.apply(this, arguments));
};

function CustomError() {
  // Use V8's feature to get a structured stack trace
  const oldStackTrace = Error.prepareStackTrace;
  const oldLimit = Error.stackTraceLimit;
  try {
    Error.stackTraceLimit = 3; // <- we only need the top 3
    Error.prepareStackTrace = function (err, structuredStackTrace) {
      return structuredStackTrace;
    };
    Error.captureStackTrace(this, CustomError);
    this.stack; // <- invoke the getter for 'stack'
  } finally {
    Error.stackTraceLimit = oldLimit;
    Error.prepareStackTrace = oldStackTrace;
  }
}

function getFileInfo() {
  const stack = new CustomError().stack;
  const CALLER_INDEX = 2; // <- position in stacktrace to find deepest caller
  const element = stack[CALLER_INDEX];
  return element.getFileName() + ':' + element.getLineNumber() + ':' + element.getColumnNumber();
}

process.on('unhandledRejection', function (reason, p) {
  console.log(reason);
});

module.exports = function (fileName) {
  var mainLogger = {
    error: function (text) {
      if (typeof text === 'object')
        text = JSON.stringify(text);
      logger.error(getFileInfo() + ' : ' + text)
    },
    info: function (text) {
      if (typeof text === 'object')
        text = JSON.stringify(text);
      logger.info(getFileInfo() + ' : ' + text)
    }
  }

  return mainLogger
}