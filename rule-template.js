"use strict";

const NAME = 'name'

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
}
module.exports.name = NAME;
