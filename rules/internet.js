"use strict";
var http = require('http');

const NAME = 'internet'

module.exports.run = function (log, cb_) {
  function cb(error, success, data) {
    if (error) {
      return cb_(error, false, NAME, null);
    }
    cb_(error, success, NAME, data);
  }

  log.http(NAME, 'Begining request for example.com');

  http.get('http://example.com', (res) => {
    log.http(NAME, 'Finished request for example.com');
    cb(null, true);
  }).on('error', (e) => {
    log.error(NAME, 'Error while fetching.');
    if (e.code === 'EAI_AGAIN') {
      cb(null, false, e);
    } else {
      cb(e);
    }
  });
}
module.exports.name = NAME;
