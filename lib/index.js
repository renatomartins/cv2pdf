'use strict';

var os = require('os');
var fs = require('fs');
var path = require('path');
var minimist = require('minimist');
var childProcess = require('child_process');
var Remarkable = require('remarkable');
var phantomPath = require('phantomjs').path;

var phantomAssetsDir = path.join(__dirname, '..', 'phantom-assets');
var defaultCssFile = path.join(phantomAssetsDir, 'style.css');
var phantomScriptFile = path.join(phantomAssetsDir, 'script.js');


function Cv2Pdf(file, options) {
  var markdownExtension = path.extname(file);
  this.basename = path.basename(file, markdownExtension);
  this.markdownFile = path.normalize(file);

  if (Cv2Pdf.markdownExtensions.indexOf(markdownExtension) === -1)
    throw Error('The CV file should be in Markdown format');

  this.setPaths(options);
}


Cv2Pdf.markdownExtensions = [
  '.md', '.markdown', '.mkdown', '.mdown', '.mkdn', '.mkd',
  '.mdwn', '.mdtxt', '.mdtext', '.txt', '.text'
];


Cv2Pdf.prototype.setPaths = function (options) {
  this.cssFile = options.css || defaultCssFile;
  this.htmlFile = this.basename + '.html';
  this.pdfFile = options.out || this.basename + '.pdf';

  if (!options.saveHtml) {
    this.htmlFile = path.join(os.tmpdir(), this.htmlFile);
  }
};


Cv2Pdf.prototype.convert = function () {
  var html = this.convertToHtml();
  var css = this.getCssContent();
  html = '<style>' + css + '</style>' + html;
  this.writeHtml(html);

  this.convertToPdf(html);
};


Cv2Pdf.prototype.convertToHtml = function () {
  var markdown = fs.readFileSync(this.markdownFile, 'utf8');
  var remarkable = new Remarkable({
    html: true,
    breaks: true
  });
  return remarkable.render(markdown);
};


Cv2Pdf.prototype.getCssContent = function () {
  var css;
  try {
    css = fs.readFileSync(this.cssFile, 'utf8');
  } catch (e) {
    css = '';
  }
  return css;
};


Cv2Pdf.prototype.writeHtml = function (html) {
  fs.writeFileSync(this.htmlFile, html, 'utf8');
};


Cv2Pdf.prototype.convertToPdf = function () {
  childProcess.execFile(phantomPath, [
    phantomScriptFile,
    this.htmlFile,
    this.pdfFile
  ]);
};


module.exports = Cv2Pdf;
