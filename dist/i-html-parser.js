(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.HTML = factory());
})(this, (function () { 'use strict';

  var selfClosingTags = {
    area: null,
    base: null,
    br: null,
    col: null,
    embed: null,
    hr: null,
    img: null,
    input: null,
    link: null,
    meta: null,
    param: null,
    source: null,
    track: null,
    wbr: null
  };

  var regexp = /<[\s\S]*?>[^<]*/g;
  var documentType = '<!DOCTYPE html>';
  var parse = function parse(html) {
    html = html.trim();
    if (html.startsWith(documentType)) {
      html = html.slice(documentType.length);
    }
    var ast = {
      type: 'root',
      attrs: {},
      parent: null,
      tagName: null,
      children: []
    };
    var matched = html.match(regexp);
    var parent = ast;
    var _loop = function _loop() {
      // <html lang="en">
      // <input foo="bar" />
      // <title>Document
      // <div foo="bar">foo
      // </div>
      var m = matched[i].trim();
      if (!m.startsWith('</')) {
        // <html lang="en"> -> html lang="en">
        m = m.slice(1);
        var tagName = m.match(/[^\s>]*/)[0];
        var attrs = {};
        var node = {
          type: 'tag',
          attrs: attrs,
          parent: parent,
          tagName: tagName,
          children: []
        };

        // div foo="bar">foo -> foo="bar">foo
        // html lang="en"> -> lang="en">
        // title>Document -> >Document
        m = m.slice(tagName.length).trimStart();
        if (m !== '>') {
          // >Document
          if (m.startsWith('>')) {
            node.children.push({
              type: 'text',
              text: m.slice(1).trimStart()
            });
          } else {
            // lang="en">
            // foo="bar">foo
            m.replace(/\s*(.*?)=['"]\s*([\s\S]*?)\s*['"]/g, function (_, $1, $2) {
              var attr = $1.trimStart();
              attrs[attr] = $2;

              // if (options.extractStyle && attr === 'style') {
              //   const styles = {}

              //   $2.replace(/\s*(.*?)\s*:\s*(.*?)\s*[;]/g, (_, prop, value) => {
              //     styles[prop] = value
              //   })

              //   node.styles = styles
              // }
            });

            var text = m.match(/>([\s\S]*)/)[1];
            if (text) {
              node.children.push({
                type: 'text',
                text: text
              });
            }
          }
        }
        parent.children.push(node);
        if (!selfClosingTags.hasOwnProperty(tagName)) {
          parent = node;
        }
      } else {
        parent = parent.parent;
      }
    };
    for (var i = 0, l = matched.length; i < l; i++) {
      _loop();
    }
    return ast;
  };

  var genElement = function genElement(node) {
    var res = '';
    var attrs = node.attrs,
      tagName = node.tagName,
      children = node.children;
    var keys = Object.keys(attrs);
    var _attrs = keys.length ? " ".concat(genAttrs(attrs, keys)) : '';
    res += "<".concat(tagName).concat(_attrs, ">");
    if (!selfClosingTags.hasOwnProperty(tagName)) {
      var _children = children.length ? stringify(node) : '';
      res += "".concat(_children, "</").concat(tagName, ">");
    }
    return res;
  };
  var genText = function genText(node) {
    return node.text;
  };
  var genAttrs = function genAttrs(attrs, keys) {
    var res = '';
    for (var i = 0, l = keys.length; i < l; i++) {
      var attr = keys[i];
      var value = attrs[attr];
      res += "".concat(attr, "=\"").concat(value, "\" ");
    }
    return res.slice(0, -1);
  };
  var stringify = function stringify(ast) {
    var html = '';
    var nodes = ast.children;
    for (var i = 0, l = nodes.length; i < l; i++) {
      var node = nodes[i];
      if (node.type === 'tag') {
        html += genElement(node);
      } else {
        html += genText(node);
      }
    }
    return html;
  };

  var HTML = {
    parse: parse,
    stringify: stringify
  };

  return HTML;

}));
