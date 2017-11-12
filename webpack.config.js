const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/Grid.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'grid.min.js',
    libraryTarget: 'umd',
    library: 'Grid'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    //new webpack.optimize.UglifyJsPlugin()
  ]
}

