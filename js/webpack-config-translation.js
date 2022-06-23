var path = require('path');
var webpack = require('webpack');
var ExtractTranslationKeysPlugin = require('translations-keys');

module.exports = function(name) {
  var plugins = [
    new ExtractTranslationKeysPlugin({
      functionName: '__',
      output: path.resolve('./build/' + name + '-translation-keys.json'),
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ];
  var app = ['babel-polyfill', name];

  return {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: ['babel-loader'],
          exclude: [/node_modules/],
        },
        {
          test: /\.less$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
            {
              loader: 'less-loader',
              options: {
                noIeCompat: true,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.svg$/,
          use: ['svg-react-loader'],
        },
        {
          test: /\.json$/,
          use: ['json-loader'],
        },
      ],
    },

    entry: {
      'transl': app,
    },

    resolve: {
      modules: ['js', 'node_modules'],
      extensions: ['.js', '.jsx', '.css'],
    },

    output: {
      filename: '[name].js',
      path: path.resolve('./build/'),
      publicPath: '/',
    },
    plugins: plugins,
  };
};
