"use strict";
var semver = require('semver');
var rules = require('./rules');
var log = require('npmlog');
var symbols = require('log-symbols');
log.heading = 'npm';
log.addLevel('success', 5000, {}, symbols.success);
log.disp.warn = symbols.warning;
module.exports = function (level, cb) {
  level && log.level = level;
  rules.run('all', log, function (err, clean) {
    cb && cb(err, clean);
    if (err) {
      log.error('troubleshoot', 'Error while running rules:', err.message);
      return process.exit(1);
    }
    if (!clean) {
      log.warn('troubleshoot', 'Some tests failed');
      return process.exit(1);
    }
    log.success('troubleshoot', 'All tests succeeded');
    process.exit(0);
  });
};
