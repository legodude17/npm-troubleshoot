"use strict";
var rules = exports = module.exports = {};
var fs = require('fs');
var path = require('path');
var util = require('util');
var msg = require('../message');
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
    var messages = {};
    function status() {
      return '(' + rulesRun + '/' + rulesToRun + ')';
    }
    function logMessages(messages) {
      var message = ['Some tests failed:'];
      Object.keys(messages).forEach(function (v) {
        message.push(v + ':   ' + messages[v]);
      });
      log.error('rules', message.join('\n    '));
    }
    function next(err, success, name, message, data) {
      rulesRun++;
      if (err) {
        error = true;
        log.error('rules', 'Rule', name, 'errored', status() + ':', err.message);
      } else if (!success) {
        clean = false;
        if (message) {
          console.log(message, data);
          messages[name] = msg(message, data || []);
        }
        log.warn('rules', 'Rule', name, 'failed', status() + '.');
      } else {
        data = message
        log.success('rules', 'Rule', name, 'succeeded', status() + (data ? ':\n' + util.format(data) : '.'));
      }
      if (rulesRun >= rulesToRun) {
        log.silly('rules', 'All done');
        logMessages(messages);
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
