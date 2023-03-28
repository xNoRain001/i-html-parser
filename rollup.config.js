import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: './src/index.js',
  output: {
    file: './dist/i-html-parser.js',
    format: 'umd',
    name: 'HTML'
  },
  plugins: [
    babel({ exclude: './node_modules/**' }),
    resolve()
  ]
}