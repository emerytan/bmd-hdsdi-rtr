import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import nodePolyfills from 'rollup-plugin-polyfill-node'

export default {
	input: './src/app.js',
	output: {
		file: './build/bundle.js',
		format: 'iife',
	},
	plugins: [
		nodeResolve({
			jsnext: true,
			main: true,
			browser: true
		}),
		commonjs(),
		babel({ 
			babelHelpers: 'bundled',
			exclude: 'node_modules/**' 
		}),
		nodePolyfills()
	]
}
