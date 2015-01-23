var system = require('system');
var page = require('webpage').create();

var args = system.args.slice(1);
var htmlFilename = args[0];
var pdfFilename = args[1];

page.open(htmlFilename, function () {
  page.paperSize = {
    format: 'A4',
    margin: {
      top: '1cm',
      left: '1cm',
      right: '1cm',
      bottom: '0.5cm'
    },
    footer: {
      height: '0.5cm',
      contents: phantom.callback(function (pageNum, numPages) {
        return '<span style="float:right;font-family:Georgia;font-size:.8em">' + pageNum + ' / ' + numPages + '</span>';
      })
    }
  };

  page.render(pdfFilename);
  phantom.exit();
});
