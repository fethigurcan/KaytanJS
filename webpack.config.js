const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = [
  {
    entry: './babelsrc/index.js',
    mode:'production',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'kaytan-babel.js'
    }
  },
  {
    entry: './babelsrc/index.js',
    mode:'development',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'kaytan-babel-dev.js'
    }
 },
 {
    entry: './src/index.js',
    mode:'production',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'kaytan.js'
    }
  },
  {
    entry: './src/index.js',
    mode:'development',
    plugins: [new CleanWebpackPlugin()], //we need at last config (backward sequence)
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'kaytan-dev.js'
    }
  }
];