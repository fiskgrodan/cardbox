import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const onwarn = warning => {
  // Silence circular dependency warnings...
  if ( warning.code === 'CIRCULAR_DEPENDENCY' ) {
    return
  }
}

export default [
  {
		input: 'src/main.js',
		onwarn,
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
		],
		plugins: [
      resolve(),
			commonjs(),
			terser()
    ]
  }
];
