"use strict";
var exec = require('child_process').exec;
var vm = require('vm');
var semver = require('semver');

const MIN_NODE_VERSION = '6.0.0';
const MIN_NPM_VERSION = '3.10.0';
const NAME = 'versions';

function evalVersions(str) {
  var versions;
  return vm.runInNewContext('(' + str + ')');
}
function checkVersions(versions) {
  var nodeVer = versions.node;
  var npmVer = versions.npm;
  if (semver.lt(nodeVer, MIN_NODE_VERSION)) {
    return 'node';
  }
  if (semver.lt(npmVer, MIN_NPM_VERSION)) {
    return 'npm';
  }
  return true;
}
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

  log.verbose('versions', 'Running `npm version`');


  exec('npm version', function (error, versions) {
    if (error) {
      log.error('versions', 'Command failed');
      return cb(error);
    }
    log.verbose('versions', 'Versions:\n', versions);
    log.silly('versions', 'Evaling versions');
    try {
      versions = evalVersions(versions);
    } catch (e) {
      log.error('versions', 'Failed to parse versions');
      return cb(e);
    }
    log.silly('versions', 'Checking versions');
    var version = checkVersions(versions);
    if (version === true) {
      cb(null, true, versions);
    } else {
      cb(null, false, 'upgrade', version);
    }
  });
}
module.exports.name = 'versions';
