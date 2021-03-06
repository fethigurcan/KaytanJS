const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = [
 {
    entry: './src',
    mode:'production',
    target: 'web',
    optimization: {
      minimize: true
    },    
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'kaytan.js',
      library: 'Kaytan'
    }
  },
  {
    entry: './src',
    target: 'web',
    mode:'development',
    plugins: [new CleanWebpackPlugin()], //we need at last config (backward sequence)
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'kaytan-dev.js',
      library: 'Kaytan'
    }
  }
];