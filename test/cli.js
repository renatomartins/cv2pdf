var pkg = require('../package.json');
var should = require('should');
var rewire = require('rewire');
var cli = rewire('../lib/cli');


function setupTestConstructor(expectedFile, expectedOptions) {
  cli.__set__('Cv2Pdf', function (actualFile, actualOptions) {
    this.convert = function () {};
    this.watch = function () {};
    actualFile.should.be.equal(expectedFile);
    actualOptions.should.eql(expectedOptions);
  });
}


describe('CLI', function () {

  beforeEach(function () {
    this.defaultOptions = {
      css: undefined,
      out: undefined,
      html: false
    };
  });

  it('$ cv2pdf', function () {
    cli.run([], function (err, stdout) {
      err.should.startWith(pkg.description);
    });
  });

  it('$ cv2pdf --help', function () {
    cli.run(['--help'], function (err, stdout) {
      should(err).be.equal(null);
      stdout.should.startWith(pkg.description);
    });
  });

  it('$ cv2pdf cv.md', function () {
    setupTestConstructor('cv.md', this.defaultOptions);
    cli.run(['cv.md']);
  });

  it('$ cv2pdf --html cv.md', function () {
    this.defaultOptions.html = true;
    setupTestConstructor('cv.md', this.defaultOptions);
    cli.run(['--html', 'cv.md']);
  });

  it('$ cv2pdf --out=result.pdf cv.md', function () {
    this.defaultOptions.out = 'result.pdf';
    setupTestConstructor('cv.md', this.defaultOptions);
    cli.run(['--out=result.pdf', 'cv.md']);
  });

  it('$ cv2pdf --css=style.css cv.md', function () {
    this.defaultOptions.css = 'style.css';
    setupTestConstructor('cv.md', this.defaultOptions);
    cli.run(['--css=style.css', 'cv.md']);
  });

  it('$ cv2pdf --watch cv.md', function () {
    setupTestConstructor('cv.md', this.defaultOptions);
    cli.run(['--watch', 'cv.md'], function (err, stdout) {
      should(err).be.equal(null);
      stdout.should.startWith('Watching cv.md');
    });
  });

});
