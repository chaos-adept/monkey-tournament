/**
 * Created by drykovanov on 8/21/2016.
 */
const path = require('path');
const getAppVersion = require('./../etc/get-app-version');
const version = getAppVersion().buildVersion;
const publicPath = '/client/' + version + '/';
const entry = path.resolve(__dirname, '../client/app-entry.js');
const webpack = require('webpack');

function mixinHmr(entries) {
    var result = {};
    Object.keys(entries).forEach(key =>
        result[key] = ['webpack/hot/dev-server', 'webpack-hot-middleware/client', entries[key]]
    );
    return result;
}

module.exports = {
    version,
    debug: true,
    inline: true,
    devtool: "#source-map",
    entry: mixinHmr({index: entry}),
    env: "NODE_ENV",
    root: [
        path.resolve(__dirname, '../lib/'),
    ],
    alias: {
        'Promise': 'bluebird',
    },
    output: {
        path: path.resolve(__dirname, '../../build' + publicPath),
        filename: '[name].js',
        publicPath: publicPath
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }]
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin(),
    ]
};