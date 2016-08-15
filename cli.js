#! /usr/bin/node
"use strict";
var tr = require('.');
var level = process.argv[2];
class LogWaring extends Error {
  constructor(message, detail) {
    super(message);
    this.name = 'LogWarning';
    this.detail = detail;
  }
}
if (level === 'silent') {
  process.emitWarning(new LogWaring('npm-troubleshoot is meant to be used with logging.', 'If you are using this in a lib, please just `require("npm-troubleshoot")` instead of running the cli'));
}
tr(level, function (err, clean) {
  if (err || !clean) {
    return process.exit(1);
  }
  process.exit(0);
});
