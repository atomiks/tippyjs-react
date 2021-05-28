module.exports = {
  presets: [
    ['@babel/env', {loose: true, useBuiltIns: 'entry', corejs: 3}],
    '@babel/react',
  ],
  plugins: ['annotate-pure-calls'],
  env: {
    test: {
      presets: [
        ['@babel/env', {targets: {node: 'current'}}],
        '@babel/react',
      ]
    }
  }
};
