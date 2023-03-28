import selfClosingTags from './self-closing-tags'

const regexp = /<[\s\S]*?>[^<]*/g
const documentType = '<!DOCTYPE html>'

const parse = (html, options = {}) => {
  html = html.trim()

  if (html.startsWith(documentType)) {
    html = html.slice(documentType.length)
  }

  const ast = {
    type: 'root',
    attrs: {},
    parent: null,
    tagName: null,
    children: []
  }
  const matched = html.match(regexp)
  let parent = ast

  for (let i = 0, l = matched.length; i < l; i++) {
    // <html lang="en">
    // <input foo="bar" />
    // <title>Document
    // <div foo="bar">foo
    // </div>
    let m = matched[i].trim()

    if (!m.startsWith('</')) {
      // <html lang="en"> -> html lang="en">
      m = m.slice(1)

      const tagName = m.match(/[^\s>]*/)[0]
      const attrs = {}
      const node = {
        type: 'tag',
        attrs,
        parent,
        tagName,
        children: []
      }
    
      // div foo="bar">foo -> foo="bar">foo
      // html lang="en"> -> lang="en">
      // title>Document -> >Document
      m = m.slice(tagName.length).trimStart()

      if (m !== '>') {
        // >Document
        if (m.startsWith('>')) {
          node.children.push({
            type: 'text',
            text: m.slice(1).trimStart()
          })
        } else {
          // lang="en">
          // foo="bar">foo
          m.replace(/\s*(.*?)=['"]\s*([\s\S]*?)\s*['"]/g, (_, $1, $2) => {
            const attr = $1.trimStart()

            attrs[attr] = $2

            // if (options.extractStyle && attr === 'style') {
            //   const styles = {}

            //   $2.replace(/\s*(.*?)\s*:\s*(.*?)\s*[;]/g, (_, prop, value) => {
            //     styles[prop] = value
            //   })

            //   node.styles = styles
            // }
          })

          const text = m.match(/>([\s\S]*)/)[1]
          
          if (text) {
            node.children.push({
              type: 'text',
              text
            }) 
          }
        }
      }

      parent.children.push(node)

      if (!selfClosingTags.hasOwnProperty(tagName)) {
        parent = node
      }
    } else {
      parent = parent.parent
    }
  }

  return ast
}

export default parse
