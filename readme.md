# cv2pdf

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
```

Options:
 * --out | -o: output filename
 * --css | -c: custom css
 * --save-html | -s: whether to save an html file
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
cv2pdf.convert();
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
