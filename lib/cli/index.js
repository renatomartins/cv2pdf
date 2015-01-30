'use strict';

process.title = 'cv2pdf';

var pkg = require('../../package.json');
var os = require('os');
var minimist = require('minimist');
var Cv2Pdf = require('..');

var description = pkg.description;
var usage =
  'Usage: cv2pdf ' +
  '[--help] ' +
  '[-o|--out=cv.pdf] ' +
  '[-c|--css=style.css] ' +
  '[-h|--html] ' +
  '[-w|--watch] ' +
  'cv.md';


function run(argv, callback) {
  var opts = getCommandLineOptions(argv);

  if (opts.help || opts._.length === 0) {
    var message = description + os.EOL + usage;
    return opts.help
      ? callback(null, message)
      : callback(message);
  }

  var markdownFile = opts._[0];
  try {
    var cv2pdf = new Cv2Pdf(markdownFile, {
      out: opts.out,
      css: opts.css,
      html: opts.html
    });

    if (opts.watch) {
      callback(null, 'Watching ' + markdownFile + ' (Ctrl+C to exit)');
      cv2pdf.watch(function (err) {
        if (err) {
          return callback(err);
        }
        callback(null, 'Converted at ' + (new Date()).toString());
      });
    } else {
      cv2pdf.convert();
    }

  } catch (e) {
    callback(e.message + os.EOL + usage);
  }
}


function getCommandLineOptions(argv) {
  return minimist(argv, {
    alias: {
      o: 'out',
      c: 'css',
      h: 'html',
      w: 'watch'
    },
    boolean: ['html', 'watch', 'help']
  });
}


module.exports = {
  run: run
};
