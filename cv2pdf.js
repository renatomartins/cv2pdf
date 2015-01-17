#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var minimist = require('minimist');
var childProcess = require('child_process');
var Remarkable = require('remarkable');
var phantomPath = require('phantomjs').path;

// read the command line arguments
var opts = minimist(process.argv.slice(2), {
  alias: {
    o: 'out',
    c: 'css',
    s: 'save-html',
    h: 'help'
  },
  default: {
    s: false,
    c: path.join(__dirname, 'markdown.css')
  }
});

function printUsage() {
  console.log('Convert a Markdown resume to PDF')
  console.log(
    'Usage: cv2pdf ' +
    '[-h|--help] ' +
    '[-o|--out=cv.pdf] ' +
    '[-c|--css=style.css] ' +
    '[-s|--save-html] ' +
    'cv.md'
  );
}

if (opts.h || opts._.length === 0) {
  printUsage();
  process.exit(opts.h ? 0 : 1);
}

var markdownFilename = opts._[0];
var cssFilename = opts.c;
var phantomScriptFilename = 'phantom-script.js';

var extension = path.extname(markdownFilename);
var possibleExtensions = [
  '.md', '.markdown', '.mkdown', '.mdown', '.mkdn', '.mkd',
  '.mdwn', '.mdtxt', '.mdtext', '.txt', '.text'
];
if (possibleExtensions.indexOf(extension) === -1) {
  console.error('The CV should be in Markdown format');
  process.exit(1);
}

// generate filenames for html and pdf files
var basename = path.basename(markdownFilename, extension);
var htmlFilename = basename + '.html';
var pdfFilename = opts.o || basename + '.pdf';

// read css file
var css = fs.readFileSync(cssFilename, 'utf8');
css = '<style>' + css + '</style>';

// read markdown and convert to html
var markdownText = fs.readFileSync(markdownFilename, 'utf8');
var md = new Remarkable({
  html: true,
  breaks: true
});
var body = md.render(markdownText);

if (!opts.s) {
  var os = require('os');
  htmlFilename = path.join(os.tmpdir(), htmlFilename);
}

// write the html file
fs.writeFileSync(htmlFilename, css + body, 'utf8');

// launch phantomjs to write the pdf file
var childArgs = [
  path.join(__dirname, phantomScriptFilename),
  htmlFilename,
  pdfFilename
];
childProcess.execFile(phantomPath, childArgs);
