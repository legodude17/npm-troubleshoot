"use strict";
var rules = exports = module.exports = {};
rules.rules = rules.rules || {};
rules.run = function (names, log, cb) {
  log.silly('rules', 'Starting running of:', names);
  fs.readdir('.', function (err, contents) {
    if (err) {
      log.error('rules', 'Error reading files:', err.message);
      cb(err);
    }
    contents = contents.filter((v) => v !== 'index.js');
    log.verbose('rules', 'Contents of rules:', contents);
  });
}
