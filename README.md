# npm-troubleshoot
A utility for troubleshooting npm.

# npm
A similar command has made it into `npm` itself! Try running `npm doctor`.

# Usage

## Command Line
`npm-troubleshoot [loglevel]`

Possible log levels are:
+ all
+ silly
+ verbose
+ info
+ warn (default)
+ error and success (same level)

## In code
```js
var touble = require('npm-troubleshoot');
trouble('silent', function (err, clear) {
  //err is the error or null
  //clear is true if the tests succeeded or false if they didn't
});
```
trouble([loglevel], [rules], [cb])
+ log level same as above
+ rules are a string of space speareted names, or `'all'` to run all of them
+ cb is the callback


# Contributing
To get started check out the rule-template.js file. 
Then look at the rules dir.
