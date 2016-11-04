
const config = require('./webpack.config');
const webpack = require('webpack');

const copyStatic = require('./../etc/copy-static');
copyStatic(config.version).catch((e) => console.error(e));

config.plugins.unshift(new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    }
}));

config.plugins.unshift(new webpack.optimize.MinChunkSizePlugin({
    minChunkSize : 2000
}));

module.exports = config;
