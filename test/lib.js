var fs = require('fs');
var path = require('path');
var should = require('should');
var sinon = require('sinon');
var Cv2Pdf = require('../lib');


var fixtureMarkdownFile = 'test/fixture/example.md';
var fixtureCssFile = 'test/fixture/style.css';
var fixtureCss = fs.readFileSync(fixtureCssFile, 'utf8');
var defaultCss = fs.readFileSync(Cv2Pdf.defaultCssFile, 'utf8');


function testNotMarkdown(file) {
  var instantiate = function () {
    new Cv2Pdf(file);
  };
  instantiate.should.throw();
}


describe('Module', function () {

  var proto = Cv2Pdf.prototype;

  beforeEach(function () {
    sinon.stub(proto, 'writeHtml');
    sinon.stub(proto, 'callPhantom', function (h, p, callback) {
      callback();
    });
  });
  afterEach(function () {
    if (proto.callPhantom.restore)
      proto.callPhantom.restore();
    if (proto.writeHtml.restore)
      proto.writeHtml.restore();
  });

  it('executes callback when finished', function () {
    var cv2pdf = new Cv2Pdf(fixtureMarkdownFile);
    var spy = sinon.spy();
    cv2pdf.convert(spy);
    spy.called.should.be.true;
  });

  it('throws error unless markdown file', function () {
    testNotMarkdown(__filename);
  });

  it('throws error unless file exists', function () {
    testNotMarkdown('inexistent-file');
  });

  it('saves html file', function () {
    var cv2pdf = new Cv2Pdf(fixtureMarkdownFile, {
      saveHtml: true
    });
    cv2pdf.convert();
    var args = cv2pdf.writeHtml.args[0];
    args[0].should.be.equal(path.resolve('example.html'));
    args[1].should.be.String;
  });

  it('overrides output filename', function () {
    var cv2pdf = new Cv2Pdf(fixtureMarkdownFile, {out: 'result.pdf'});
    cv2pdf.convert();
    var args = cv2pdf.callPhantom.args[0];
    args[1].should.be.equal(path.resolve('result.pdf'));
  });

  it('uses default stylesheet', function () {
    var cv2pdf = new Cv2Pdf(fixtureMarkdownFile, {
      saveHtml: true
    });
    cv2pdf.convert();
    var args = cv2pdf.writeHtml.args[0];
    args[1].should.startWith('<style>' + defaultCss + '<\/style>');
  });

  it('allows custom stylesheet', function () {
    var cv2pdf = new Cv2Pdf(fixtureMarkdownFile, {
      css: fixtureCssFile,
      saveHtml: true
    });
    cv2pdf.convert();
    var args = cv2pdf.writeHtml.args[0];
    args[1].should.startWith('<style>' + fixtureCss + '<\/style>');
  });

  it('calls phantomJS', function () {
    var cv2pdf = new Cv2Pdf(fixtureMarkdownFile);
    cv2pdf.convert();
    var args = cv2pdf.callPhantom.args[0];
    args[0].should.be.String;
    args[1].should.be.equal(path.resolve('example.pdf'));
    should(args[2]).be.Function;
  });

  it('creates cv.pdf', function (done) {
    var cv2pdf = new Cv2Pdf(fixtureMarkdownFile);
    cv2pdf.callPhantom.restore();
    cv2pdf.convert(function () {
      fs.existsSync('example.pdf').should.be.true;
      fs.unlinkSync('example.pdf');
      done();
    });
  });

  it('creates cv.html', function (done) {
    var cv2pdf = new Cv2Pdf(fixtureMarkdownFile, {
      saveHtml: true
    });
    cv2pdf.writeHtml.restore();
    sinon.stub(cv2pdf, 'convertToPdf');
    cv2pdf.convert(function () {
      fs.existsSync('example.html').should.be.true;
      fs.unlinkSync('example.html');
      done();
    });
  });

});
