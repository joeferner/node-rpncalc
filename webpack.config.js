var webpack = require('webpack')
var getConfig = require('hjs-webpack')

module.exports = {
  devtool: 'eval-source-map',
  entry: './src/index.jsx',
  output: {
    filename: 'build/bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js|\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          "presets": ["react", "es2015", "stage-0"]
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  externals: {
      "nw": "nw"
  }
};