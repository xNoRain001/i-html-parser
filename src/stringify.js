import selfClosingTags from './self-closing-tags'

const genElement = node => {
  let res = ''
  const { attrs, tagName, children } = node
  const keys = Object.keys(attrs)
  const _attrs = keys.length ? ` ${ genAttrs(attrs, keys) }` : ''
  
  res += `<${ tagName }${ _attrs }>`

  if (!selfClosingTags.hasOwnProperty(tagName)) {
    const _children = children.length ? stringify(node) : ''

    res += `${ _children }</${ tagName }>`
  }

  return res
}

const genText = node => node.text

const genAttrs = (attrs, keys) => {
  let res = ''

  for (let i = 0, l = keys.length; i < l; i++) {
    const attr = keys[i]
    const value = attrs[attr]

    res += `${ attr }="${ value }" `
  }

  return res.slice(0, -1)
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

export default stringify
