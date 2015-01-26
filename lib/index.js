'use strict';

var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');
var Remarkable = require('remarkable');
var phantomPath = require('phantomjs').path;

var phantomAssetsDir = path.join(__dirname, '..', 'phantom-assets');


function Cv2Pdf(file, options) {
  this.options = options || {};
  this.setFile(file);
};


Cv2Pdf.defaultCssFile = path.join(phantomAssetsDir, 'style.css');
Cv2Pdf.phantomScriptFile = path.join(phantomAssetsDir, 'script.js');
Cv2Pdf.markdownExtensions = [
  '.md', '.markdown', '.mkdown', '.mdown', '.mkdn', '.mkd',
  '.mdwn', '.mdtxt', '.mdtext', '.txt', '.text'
];


Cv2Pdf.prototype.setFile = function (file) {
  if (!fs.existsSync(file)) {
    throw new Error('File doesn\'t exist');
  }

  var markdownExtension = path.extname(file);
  this.basename = path.basename(file, markdownExtension);
  this.markdownFile = path.normalize(file);

  if (Cv2Pdf.markdownExtensions.indexOf(markdownExtension) === -1) {
    throw new Error('The CV file should be in Markdown format');
  }

  this.setPaths(this.options);
};


Cv2Pdf.prototype.setPaths = function (options) {
  this.cssFile = path.resolve(options.css || Cv2Pdf.defaultCssFile);
  this.pdfFile = path.resolve(options.out || this.basename + '.pdf');

  if (options.saveHtml) {
    this.htmlFile = path.resolve(this.basename + '.html');
  }
};


Cv2Pdf.prototype.convert = function (callback) {
  var html = this.convertToHtml(this.markdownFile);
  var css = this.getCssContent(this.cssFile);
  html = '<style>' + css + '</style>' + html;

  if (this.htmlFile) {
    this.writeHtml(this.htmlFile, html, callback);
  }

  this.convertToPdf(html, this.pdfFile, callback);
};


Cv2Pdf.prototype.convertToHtml = function (markdownFile) {
  var markdown = fs.readFileSync(markdownFile, 'utf8');
  var remarkable = new Remarkable({
    html: true,
    breaks: true
  });
  return remarkable.render(markdown);
};


Cv2Pdf.prototype.getCssContent = function (cssFile) {
  var css;
  try {
    css = fs.readFileSync(cssFile, 'utf8');
  } catch (e) {
    css = '';
  }
  return css;
};


Cv2Pdf.prototype.writeHtml = function (htmlFile, html, callback) {
  fs.writeFile(htmlFile, html, function () {
    if (callback) {
      callback('html');
    }
  });
};


Cv2Pdf.prototype.convertToPdf = function (html, pdfFile, callback) {
  this.callPhantom(html, pdfFile, function () {
    if (callback) {
      callback('pdf');
    }
  });
};


Cv2Pdf.prototype.callPhantom = function (html, pdfFile, callback) {
  childProcess.execFile(phantomPath, [
    Cv2Pdf.phantomScriptFile,
    html,
    pdfFile
  ], callback);
};


module.exports = Cv2Pdf;
