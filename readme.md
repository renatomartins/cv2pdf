# cv2pdf [![Build Status](https://travis-ci.org/renatomartins/cv2pdf.svg?branch=master)](https://travis-ci.org/renatomartins/cv2pdf)

Convert a Markdown CV to PDF.

## Install:

Requirements:

 * Node.js

```
$ npm install --global cv2pdf
```

## Usage

### Command line

```sh
# basic example
$ cv2pdf cv.md

# with some options
$ cv2pdf --out=cv-2015.pdf --save-html --css=style.css cv.md

# converts everytime the file is saved
$ cv2pdf --watch cv.md
```

Options:
 * --out | -o: output filename
 * --css | -c: custom css
 * --save-html | -s: whether to save an html file
 * --watch | -w: converts everytime the file is saved
 * --help | -h: help message

### Programmatic

```js
var Cv2Pdf = require('cv2pdf');

// basic example
var cv2pdf = new Cv2Pdf('cv.md');
cv2pdf.convert();

// with some options
var cv2pdf = new Cv2Pdf('cv.md', {
  out: 'cv-2015.pdf',
  css: 'style.css',
  saveHtml: true
});
// execute code when finished, once for each task
// ie: if `saveHtml` this will run twice
cv2pdf.convert(function (task) {
  console.log(task + ': Done!');
});

// watch modifications on a file
cv2pdf.watch(function (err) {
  console.log('Last converted: ' + Date.now());
});
```

## Styling

Apart from all the HTML tags you can style, the PDF will also render a footer for each page with the class `page-footer`:

```html
<span class="page-footer">1 / 3</span>
```

## License

Public Domain


## Acknowledgments

 * default CSS based on [jasonm23/markdown-css-themes](https://github.com/jasonm23/markdown-css-themes/blob/2bab19caff1590ede65821cedd5cd1ac4d63233d/markdown5.css)
