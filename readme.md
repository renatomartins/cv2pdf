# cv2pdf [![Build Status](https://travis-ci.org/renatomartins/cv2pdf.svg?branch=master)](https://travis-ci.org/renatomartins/cv2pdf)

Convert a Markdown CV to PDF.

## Install:

Requirements:

 * Node.js

```
$ npm install -g cv2pdf
```

## Usage

### Command line

Options:
 * --out | -o: output filename
 * --css | -c: custom css
 * --html | -h: whether to save an html file
 * --watch | -w: converts everytime the file is saved
 * --help: show usage

```sh
# basic example
$ cv2pdf cv.md

# change the output filename
$ cv2pdf --out=cv-latest.pdf cv.md

# save only the html and apply custom css
$ cv2pdf --html --css=style.css cv.md

# convert to html everytime the file is saved
$ cv2pdf --watch --html cv.md
```

### Programmatic

```js
var Cv2Pdf = require('cv2pdf');

// basic example
var cv2pdf = new Cv2Pdf('cv.md');
cv2pdf.convert();

// change the output filename
var cv2pdf = new Cv2Pdf('cv.md', {out: 'cv-latest.pdf'});
cv2pdf.convert();

// save only the html and apply custom css
var cv2pdf = new Cv2Pdf('cv.md', {html: true, css: 'style.css'});
cv2pdf.convert();

// this method is asynchronous
cv2pdf.convert(function () {
  console.log('Done!');
});

// watch modifications on a file, also asynchronous
cv2pdf.watch(function (err) {
  if (err) return console.error(err);
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
