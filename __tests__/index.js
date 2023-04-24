const HTML = require('../dist/html-parser.min')

const ast = {
  type: 'root',
  attrs: {},
  parent: null,
  tagName: null,
  children: []
} 

ast.children.push({
  type: 'tag',
  attrs: { lang: 'en' },
  parent: ast,
  tagName: 'html',
  children: []
})

const examples = {
  '<html lang="en"></html>': ast,
  '<html lang="en"></html>': ast,
  '<html  lang="en" ></html>': ast,
  [`
    <html 
      lang="en"
    ></html>
  `]: ast,
}

test('test line code', () => {
  for (const key in examples) {
    expect(HTML.parse(key).ast).toStrictEqual(examples[key])
  }
})
