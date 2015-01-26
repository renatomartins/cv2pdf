'use strict';

process.title = 'cv2pdf';

var pkg = require('../../package.json');
var os = require('os');
var minimist = require('minimist');
var Cv2Pdf = require('..');

var description = pkg.description;
var usage =
  'Usage: cv2pdf ' +
  '[-h|--help] ' +
  '[-o|--out=cv.pdf] ' +
  '[-c|--css=style.css] ' +
  '[-s|--save-html] ' +
  'cv.md';


function run(argv, callback) {
  var opts = getCommandLineOptions(argv);

  if (opts.h || opts._.length === 0) {
    var message = description + os.EOL + usage;
    return opts.h
      ? callback(null, message)
      : callback(message);
  }

  var markdownFile = opts._[0];
  try {
    var cv2pdf = new Cv2Pdf(markdownFile, {
      out: opts.o,
      css: opts.c,
      saveHtml: opts.s
    });
    cv2pdf.convert();
  } catch (e) {
    callback(e.message + os.EOL + usage);
  }
}


function getCommandLineOptions(argv) {
  return minimist(argv, {
    alias: {
      o: 'out',
      c: 'css',
      s: 'save-html',
      h: 'help'
    },
    boolean: ['s']
  });
}


module.exports = {
  run: run
};
