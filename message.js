"use strict";
var messages = require('./messages');
var util = require('util');
module.exports = function (name, data) {
  console.log(name, data);
  return util.format(messages[name], ...data);
}
