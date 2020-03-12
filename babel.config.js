module.exports = {
  presets: [
    ['@babel/env', {loose: true, useBuiltIns: 'entry', corejs: 3}],
    '@babel/react',
  ],
  plugins: ['annotate-pure-calls'],
};
