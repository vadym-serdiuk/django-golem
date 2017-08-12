/*eslint-disable no-var, one-var, func-names, indent, prefer-arrow-callback, object-shorthand, no-console, newline-per-chained-call, one-var-declaration-per-line, prefer-template, vars-on-top */
const path = require('path');
const webpack = require('webpack');
const ExtractText = require('extract-text-webpack-plugin');
const WebpackNotifier = require( 'webpack-notifier' );
const autoprefixer = require('autoprefixer');

const isProd = process.env.NODE_ENV === 'production';

const cssLoaders = ['css?sourceMap', 'postcss?pack=custom', 'sass?sourceMap'];
const config = {
  context: path.join(__dirname, '../app'),
  resolve: {
    alias: {
      modernizr$: path.join(__dirname, '.modernizrrc'),
      assets: path.join(__dirname, '../assets')
    },
    modules: [path.join(__dirname, '../app', 'scripts'), 'node_modules'],
    extensions: ['.js', '.jsx', '.json']
  },
  resolveLoader: {
    moduleExtensions: ['-loader'],
  },
  entry: {},
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].[hash].js'
  },
  devtool: isProd ? 'source-map' : 'cheap-module-inline-source-map',
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: '/',
        postcss: function() {
          return {
            defaults: [autoprefixer],
            custom: [
              autoprefixer({
                browsers: [
                  'ie >= 9',
                  'ie_mob >= 10',
                  'ff >= 30',
                  'chrome >= 34',
                  'safari >= 7',
                  'opera >= 23',
                  'ios >= 7',
                  'android >= 4.4',
                  'bb >= 10'
                ]
              })
            ]
          };
        }
      }
    }),
    new WebpackNotifier({
        title: 'Golem JS',
        alwaysNotify: true,
        excludeWarnings: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel?cacheDirectory'],
        include: [
          path.join(__dirname, '../app', 'scripts')
        ]
      },
      {
        test: /\.scss$/,
        loader: isProd ? ExtractText.extract(cssLoaders.join('!')) : ['style'].concat(cssLoaders).join('!')
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: ['url?limit=10000&minetype=application/font-woff&name=/fonts/[name].[ext]'],
        include: /fonts/
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: ['file?name=/fonts/[name].[ext]'],
        include: /fonts/
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/i,
        use: [
          'file?hash=sha512&digest=hex' + (isProd ? '&name=/media/[name].[ext]' : ''),
          'image-webpack?bypassOnDebug=false&optimizationLevel=7&interlaced=false'
        ],
        include: /media/
      },
      {
        test: /\.json$/,
        use: ['json']
      },
      {
        test: /\.modernizrrc$/,
        use: ['modernizr']
      },
      {
        test: /\.md$/,
        use: ['html', 'markdown']
      }
    ]
  }
};

module.exports = config;
