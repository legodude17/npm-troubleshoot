"use strict";
var rules = exports = module.exports = {};
var fs = require('fs');
var path = require('path');
var util = require('util');
rules.rules = rules.rules || {};
rules.run = function (names, log, cb) {
  log.silly('rules', 'Got names:', names);
  fs.readdir(__dirname, function (err, contents) {
    if (err) {
      log.error('rules', 'Error reading files:', err.message);
      cb(err);
    }
    contents = contents.filter((v) => v !== 'index.js');
    log.silly('rules', 'Contents of rules:', contents);
    contents.forEach(function (v) {
      rules.rules[v] = rules.rules[v] || require(path.join(__dirname, v));
    });
    if (names === 'all') {
      names = contents;
    } else {
      names = names.split(/,? /);
    }
    log.info('rules', 'Starting running of:', names.map((v) => rules.rules[v].name).join(', '));
    var rulesRun = 0;
    var rulesToRun = names.length;
    var error = false, clean = true;
    function status() {
      return '(' + rulesRun + '/' + rulesToRun + ')';
    }
    function next(err, success, name, data) {
      rulesRun++;
      if (err) {
        error = true;
        log.error('rules', 'Rule', name, 'errored:', err.message, status());
      } else if (!success) {
        clean = false;
        log.warn('rules', 'Rule', name, 'failed', status() + '.');
      } else {
        log.success('rules', 'Rule', name, 'succeeded', status() + (data ? ':\n' + util.format(data) : '.'));
      }
      if (rulesRun >= rulesToRun) {
        log.silly('rules', 'All done');
        if (error) {
          cb(err);
        } else {
          cb(null, clean);
        }
      }
    }
    if (names.length) {
      names.forEach(function (v) {
        log.info('rules', 'Starting rule:', rules.rules[v].name);
        rules.rules[v].run(log, next);
      });
    } else {
      next(null, true, 'None');
    }
  });
}
