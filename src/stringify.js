const selfClosingTags = require('./self-closing-tags')

const genElement = node => {
  let res = ''
  const { attrs, tagName, children, tailwindExp } = node
  const keys = Object.keys(attrs)
  const _attrs = keys.length || tailwindExp 
    ? ` ${ genAttrs(attrs, keys, tailwindExp) }` 
    : ''

  res += `<${ tagName }${ _attrs }>`

  if (!selfClosingTags.hasOwnProperty(tagName)) {
    const _children = children.length ? stringify(node) : ''

    res += `${ _children }</${ tagName }>`
  }

  return res
}

const genText = node => node.text

const genAttrs = (attrs, keys, tailwindExp) => {
  let res = ''

  for (let i = 0, l = keys.length; i < l; i++) {
    const attr = keys[i]
    const value = attrs[attr]

    if (attr !== 'class') {
      res += `${ attr }="${ value }" `
    }
  }

  if (tailwindExp) {
    // don't add tailwind expression by attr.class because element selector.
    res += `class="${ tailwindExp } `

    if (attrs.class) {
      res += `${ Object.keys(attrs.class).join() }`
    }

    res += '"'
  }

  return res
}

const stringify = ast => {
  let html = ''
  const nodes = ast.children

  for (let i = 0, l = nodes.length; i < l; i++) {
    const node = nodes[i]

    if (node.type === 'tag') {
      html += genElement(node)
    } else {
      html += genText(node)
    }
  }

  return html
}

module.exports = stringify
