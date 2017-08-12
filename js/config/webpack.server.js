/*eslint-disable no-var, one-var, func-names, indent, prefer-arrow-callback, prefer-template, object-shorthand, no-console, newline-per-chained-call, one-var-declaration-per-line, vars-on-top */
const path = require('path');
const spawn = require('child_process').spawn;
const spawnSync = require('child_process').spawnSync;
const webpack = require('webpack');
const merge = require('webpack-merge');
const moment = require('moment');
const WebpackDevServer = require('webpack-dev-server');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const webpackConfig = require('./webpack.config');

const args = process.argv.slice(2);

function getIPAddress() {
  const interfaces = require('os').networkInterfaces();

  for (let devName in interfaces) {
    if ({}.hasOwnProperty.call(interfaces, devName)) {
      const iface = interfaces[devName];

      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          return alias.address;
        }
      }
    }
  }

  return '0.0.0.0';
}

let envPlugin;

if (args[0] && args[0] === 'test:ui') {
  envPlugin = new webpack.DefinePlugin({
    NIGHTWATCH: JSON.stringify(true),
  });
} else {
  envPlugin = new BrowserSyncPlugin({
    host: getIPAddress(),
    port: 3001,
    notify: true,
    logPrefix: 'Golem',
    proxy: 'http://localhost:3030'
  }, {
    reload: false
  });
}

const config = merge.smart(webpackConfig, {
  cache: false,
  output: {
    path: path.join(__dirname, "build/"),
    filename: 'static/[name].js',
    publicPath: '/static/'
  },
  entry: {
    golem: [
      'webpack-dev-server/client?http://localhost:3030/',
      'webpack/hot/only-dev-server',
      'react-hot-loader/patch',
      './scripts/main.jsx'
    ],
    modernizr: './scripts/vendor/modernizr-custom.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    envPlugin
  ]
});

const compiler = webpack(config);
let start;

compiler.plugin('compile', function() {
  start = moment();
  console.log(start.format('hh:mm:ss') + ' Bundling...');
});

compiler.plugin('emit', function(compilation, callback) {
  const now = moment();
  console.log('Duration: ' + now.diff(start, 's') + 's');
  console.log('Hash: ' + compilation.hash);

  if (args[0] && args[0] === 'test:ui') {
    spawnSync('pkill', ['-f', 'selenium']);

    const nightwatch = spawn(path.join(__dirname, '../node_modules/.bin/nightwatch'), [
      '-c',
      path.join(__dirname, '../test/__setup__/nightwatch.conf.js')
    ]);

    nightwatch.stdout.on('data', data => {
      process.stdout.write(data.toString());
    });

    nightwatch.stderr.on('data', data => {
      process.stdout.write(data.toString());
    });

    nightwatch.on('close', () => {
      spawn('kill', [process.pid]);
    });
  }

  callback();
});

new WebpackDevServer(compiler, {
  contentBase: path.join(__dirname, '../assets'),
  noInfo: true,
  // hot: true,
  historyApiFallback: true,
  stats: { colors: true },
  headers: {
    'Access-Control-Allow-Origin': 'http://localhost:8000',
    'Access-Control-Allow-Credentials': 'true'
  },
  openPage: '/admin/',
  open: true,
  proxy: [{
    context: ["/admin", "/media"],
    target: 'http://localhost:8000',
    secure: false
  }],
}).listen(3030, 'localhost', function(err) {
  if (err) {
    console.log('err', err);
  }
});
