#!/usr/bin/env node

var cli = require('../lib/cli')
var argv = process.argv.slice(2);

cli.run(argv, function (err, stdout) {
  if (err) {
    console.error(err);
    process.exit(1);
  } else if (output) {
    console.log(output);
  }
});
