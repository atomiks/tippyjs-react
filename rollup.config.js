import babel from 'rollup-plugin-babel';
import {terser} from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';

const pluginBabel = babel();
const pluginMinify = terser();
const pluginResolve = resolve();
const pluginReplaceEnvProduction = replace({
  'process.env.NODE_ENV': JSON.stringify('production'),
});

const COMMON_INPUT = {
  input: './src/index.js',
  external: ['react', 'react-dom', 'tippy.js', 'tippy.js/headless'],
};

const COMMON_OUTPUT = {
  name: 'Tippy',
  exports: 'named',
  sourcemap: true,
  globals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'tippy.js': 'tippy',
    'tippy.js/headless': 'tippy',
  },
};

export default [
  {
    ...COMMON_INPUT,
    plugins: [pluginBabel, pluginResolve],
    output: {
      ...COMMON_OUTPUT,
      format: 'umd',
      file: './dist/tippy-react.umd.js',
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
      file: './dist/tippy-react.umd.min.js',
    },
  },
  {
    ...COMMON_INPUT,
    plugins: [pluginBabel, pluginResolve],
    output: {
      ...COMMON_OUTPUT,
      format: 'esm',
      file: './dist/tippy-react.esm.js',
    },
  },
  {
    ...COMMON_INPUT,
    input: './src/headless.js',
    plugins: [pluginBabel, pluginResolve],
    output: {
      ...COMMON_OUTPUT,
      format: 'umd',
      file: './headless/dist/tippy-react-headless.umd.js',
    },
  },
  {
    ...COMMON_INPUT,
    input: './src/headless.js',
    plugins: [
      pluginBabel,
      pluginResolve,
      pluginMinify,
      pluginReplaceEnvProduction,
    ],
    output: {
      ...COMMON_OUTPUT,
      format: 'umd',
      file: './headless/dist/tippy-react-headless.umd.min.js',
    },
  },
  {
    ...COMMON_INPUT,
    input: './src/headless.js',
    plugins: [pluginBabel, pluginResolve],
    output: {
      ...COMMON_OUTPUT,
      format: 'esm',
      file: './headless/dist/tippy-react-headless.esm.js',
    },
  },
];
