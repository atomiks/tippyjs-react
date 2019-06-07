import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'

const pluginBabel = babel({ exclude: 'node_modules/**' })
const pluginMinify = terser()
const pluginResolve = resolve()
const pluginReplaceEnvProduction = replace({
  'process.env.NODE_ENV': JSON.stringify('production'),
})

const COMMON_INPUT = {
  input: './src/index.js',
  external: ['react', 'react-dom', 'prop-types', 'tippy.js'],
}

const COMMON_OUTPUT = {
  name: 'Tippy',
  exports: 'named',
  sourcemap: true,
  globals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'prop-types': 'PropTypes',
    'tippy.js': 'tippy',
  },
}

export default [
  {
    ...COMMON_INPUT,
    plugins: [pluginBabel, pluginResolve],
    output: {
      ...COMMON_OUTPUT,
      format: 'umd',
      file: './umd/index.js',
    },
  },
  {
    ...COMMON_INPUT,
    plugins: [
      pluginBabel,
      pluginResolve,
      pluginMinify,
      pluginReplaceEnvProduction,
    ],
    output: {
      ...COMMON_OUTPUT,
      format: 'umd',
      file: './umd/index.min.js',
    },
  },
  {
    ...COMMON_INPUT,
    plugins: [pluginBabel, pluginResolve],
    output: {
      ...COMMON_OUTPUT,
      format: 'esm',
      file: './esm/index.js',
    },
  },
  {
    ...COMMON_INPUT,
    plugins: [pluginBabel, pluginResolve, pluginMinify],
    output: {
      ...COMMON_OUTPUT,
      format: 'esm',
      file: './esm/index.min.js',
    },
  },
]
