"use strict";
var exec = require('child_process').exec;
var http = require('http');

const NAME = 'registry'

module.exports.run = function (log, cb_) {
  /*
    Log is an instance of npmlog, use it to log all of your data.

    cb_ is a funciton (error, success, name, data) call it when done
      error is an error the you find
      sucess is if the test passes
      name is the name of the test - should be the same as the one on module.exports
      data is any extra data that you have
  */


  /*
    This cb is for convienence.
    Two ways to call it:
    1. On success: same as cb_ except name.
    2. On error:
      error: same as cb_
      message: the message name to include
      data: data for the message (Messages not yet inplemented)
  */
  function cb(error, success, data) {
    if (error) {
      return cb_(error, false, NAME, data);
    }
    cb_(error, success, NAME, data);
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
        cb(null, false, e);
      } else {
        cb(e);
      }
    });
  });
}
module.exports.name = NAME;
