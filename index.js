"use strict";
var semver = require('semver');
var allRules = require('./rules');
var log = require('npmlog');
var symbols = require('log-symbols');
log.heading = 'npm';
log.addLevel('success', 5000, {}, symbols.success);
module.exports = function (level, rules, cb) {
  if (typeof cb !== 'function') {
    cb = rules;
    rules = null;
  }
  if (typeof cb !== 'function') {
    cb = level;
    level = null;
  }
  log.level = level || 'warn';
  allRules.run(rules || 'all', log, function (err, clean) {
    if (err) {
      log.error('troubleshoot', 'Error while running rules:', err.message);
      return;
    }
    if (!clean) {
      log.warn('troubleshoot', 'Some tests failed');
      return;
    }
    log.success('troubleshoot', 'All tests succeeded');
    cb && cb(err, clean);
  });
};
