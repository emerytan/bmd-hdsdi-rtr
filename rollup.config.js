import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: './src/app.js',
  output: {
    file: './build/bundle.js',
    format: 'iife'
  },
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs({
      namedExports: {
        'node_modules/bootstrap/dist/js/bootstrap.min.js' : ['bootstrap']
      }
    })
  ]
}
