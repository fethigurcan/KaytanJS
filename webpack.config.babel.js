const path = require('path');

module.exports = [
  {
    entry: './babelsrc',
    mode:'production',
    target: 'web',
    optimization: {
      minimize: false
    },    
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'kaytan-babel.js',
      library: 'Kaytan'
    }
  },
  {
    entry: './babelsrc',
    mode:'development',
    target: 'web',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'kaytan-babel-dev.js',
      library: 'Kaytan'
    }
 }
];