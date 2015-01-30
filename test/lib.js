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

  it('saves only the html', function () {
    var cv2pdf = new Cv2Pdf(fixtureMarkdownFile, {html: true});
    cv2pdf.convert();
    var args = cv2pdf.writeHtml.args[0];
    args[0].should.be.String;
    args[1].should.be.equal(path.resolve('example.html'));
    cv2pdf.callPhantom.callCount.should.be.equal(0);
  });

  it('watches a file', function (done) {
    var cv2pdf = new Cv2Pdf(fixtureMarkdownFile, {watch: true});
    var touchFile = function () {
      var buffer = fs.readFileSync(fixtureMarkdownFile);
      fs.writeFileSync(fixtureMarkdownFile, buffer);
    };
    var convertSpy = sinon.stub(cv2pdf, 'convert').yields();
    var counter = 1;
    // changes modification date of the file several times
    cv2pdf.watch(function () {
      if (counter === 3) {
        cv2pdf.convert.restore();
        return done();
      }
      convertSpy.callCount.should.be.equal(counter);
      counter++;
      setTimeout(touchFile, 10);
    });
    touchFile();
  });

  it('overrides output filename', function () {
    var cv2pdf = new Cv2Pdf(fixtureMarkdownFile, {out: 'result.pdf'});
    cv2pdf.convert();
    var args = cv2pdf.callPhantom.args[0];
    args[1].should.be.equal(path.resolve('result.pdf'));
  });

  it('uses default stylesheet', function () {
    var cv2pdf = new Cv2Pdf(fixtureMarkdownFile, {html: true});
    cv2pdf.convert();
    var args = cv2pdf.writeHtml.args[0];
    args[0].should.startWith('<style>' + defaultCss + '<\/style>');
  });

  it('allows custom stylesheet', function () {
    var cv2pdf = new Cv2Pdf(fixtureMarkdownFile, {
      css: fixtureCssFile,
      html: true
    });
    cv2pdf.convert();
    var args = cv2pdf.writeHtml.args[0];
    args[0].should.startWith('<style>' + fixtureCss + '<\/style>');
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
    var cv2pdf = new Cv2Pdf(fixtureMarkdownFile, {html: true});
    cv2pdf.writeHtml.restore();
    cv2pdf.convert(function () {
      fs.existsSync('example.html').should.be.true;
      fs.unlinkSync('example.html');
      done();
    });
  });

});
