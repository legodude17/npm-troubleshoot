"use strict";
var exec = require('child_process').exec;
var http = require('http');

const NAME = 'registry'

module.exports.run = function (log, cb_) {
  function cb(error, success, message, data) {
    if (error) {
      return cb_(error, false, NAME, data);
    }
    if (success) {
      return cb_(error, true, NAME, message);
    }
    cb_(error, false, NAME, message, data);
  }

  log.verbose(NAME, 'Running `npm config get registry`');

  exec('npm config get registry', function (err, registry) {
    if (err) {
      log.error(NAME, 'Error running command');
      return cb(err);
    }
    registry = registry.replace('https://', 'http://')
    log.info(NAME, 'Registry is:', registry);

    log.http(NAME, 'Begining request for:', registry);

    http.get(registry, (res) => {
      log.http(NAME, 'Finished request for', registry);
      cb(null, true);
    }).on('error', (e) => {
      log.error(NAME, 'Error while fetching.');
      if (e.code === 'EAI_AGAIN') {
        cb(null, false, 'registry_unreachable', [registry, registry === 'https://registry.npmjs.com' ? '' : ' Try changing you registry to https://registry.npmjs.com']);
      } else {
        cb(e);
      }
    });
  });
}
module.exports.name = NAME;
