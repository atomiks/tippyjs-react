const { rollup } = require('rollup')
const babel = require('rollup-plugin-babel')
const minify = require('rollup-plugin-babel-minify')
const resolve = require('rollup-plugin-node-resolve')

const pluginBabel = babel({
  babelrc: false,
  exclude: 'node_modules/**',
  presets: [['env', { modules: false }], 'react'],
  plugins: [
    'external-helpers',
    'transform-class-properties',
    'transform-object-rest-spread'
  ]
})
const pluginMinify = minify({ comments: false })
const pluginResolve = resolve()

const rollupConfig = (...plugins) => ({
  input: './src/Tippy.js',
  plugins: [pluginBabel, pluginResolve, ...plugins],
  external: ['tippy.js', 'react', 'react-dom', 'prop-types']
})
const output = format => file => ({
  name: 'Tippy',
  format,
  file,
  sourcemap: true,
  globals: {
    'tippy.js': 'tippy',
    react: 'React',
    'react-dom': 'ReactDOM',
    'prop-types': 'PropTypes'
  }
})

const umd = output('umd')
const esm = output('es')

const build = async () => {
  const bundle = await rollup(rollupConfig())
  const bundleMin = await rollup(rollupConfig(pluginMinify))

  bundle.write(umd('./dist/Tippy.js'))
  bundleMin.write(umd('./dist/Tippy.min.js'))
  bundle.write(esm('./dist/esm/Tippy.js'))
  bundleMin.write(esm('./dist/esm/Tippy.min.js'))
}

build()
