var system = require('system');
var page = require('webpage').create();

var html = system.args[1];
var pdfFile = system.args[2];

function replaceClassWithInlineStyle(html) {
  var el = page.evaluate(function (html) {
    var parentEl = document.createElement('div');
    document.body.appendChild(parentEl);
    parentEl.innerHTML = html;
    var el = parentEl.children[0];
    el.setAttribute('style', window.getComputedStyle(el).cssText);
    document.body.removeChild(parentEl);
    return el;
  }, html);
  return el.outerHTML;
}

function renderFooter(pageNum, numPages) {
  var span =
    '<span class="page-footer">' +
    pageNum + ' / ' + numPages +
    '</span>';
  return replaceClassWithInlineStyle(span);
}

page.content = html;

page.onLoadFinished = function () {
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
      contents: phantom.callback(renderFooter)
    }
  };

  page.render(pdfFile);
  phantom.exit();
};
