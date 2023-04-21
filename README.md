## Installation

```
npm install i-html-parser
```

## Usage

```js
// ESModule
import HTML from 'i-html-parser'
```

```js
// CommonJS
const HTML = require('i-html-parser')
```

```html
<!-- Script -->
<script src="../dist/html-parser.min.js"></script>
```

```js
const htmlStr = `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>

  <body></body>

  </html>
`

const { ast } = HTML.parse(htmlStr)
const str = HTML.stringify(ast)
```
