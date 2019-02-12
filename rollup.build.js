const { rollup } = require('rollup')
const babel = require('rollup-plugin-babel')
const { terser } = require('rollup-plugin-terser')
const resolve = require('rollup-plugin-node-resolve')

const pluginBabel = babel({ exclude: 'node_modules/**' })
const pluginMinify = terser()
const pluginResolve = resolve()

const rollupConfig = (...plugins) => ({
  input: './src',
  plugins: [pluginBabel, pluginResolve, ...plugins],
  external: ['tippy.js', 'react', 'react-dom', 'prop-types'],
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
    'prop-types': 'PropTypes',
  },
  exports: 'named',
})

const umd = output('umd')
const esm = output('es')

const build = async () => {
  const bundle = await rollup(rollupConfig())
  const bundleMin = await rollup(rollupConfig(pluginMinify))

  bundle.write(umd('./umd/index.js'))
  bundleMin.write(umd('./umd/index.min.js'))
  bundle.write(esm('./esm/index.js'))
  bundleMin.write(esm('./esm/index.min.js'))
}

build()
