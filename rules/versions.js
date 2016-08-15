"use strict";
var exec = require('child_process').exec;
var vm = require('vm');
var semver = require('semver');

const MIN_NODE_VERSION = '6.0.0';
const MIN_NPM_VERSION = '3.10.0';

function evalVersions(str) {
  var versions;
  return vm.runInNewContext('(' + str + ')');
}
function checkVersions(versions) {
  var nodeVer = versions.node;
  var npmVer = versions.npm;
  var nodeVerGood = !semver.lt(nodeVer, MIN_NODE_VERSION);
  var npmVerGood = !semver.lt(npmVer, MIN_NPM_VERSION);
  return nodeVerGood && npmVerGood;
}
module.exports.run = function (log, cb_) {
  function cb(error, success, data) {
    if (error) {
      return cb_(error, false, 'versions', null);
    }
    cb_(error, success, 'versions', data);
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
    if (checkVersions(versions)) {
      cb(null, true, versions);
    } else {
      cb(null, false, versions);
    }
  });
}
module.exports.name = 'versions';
