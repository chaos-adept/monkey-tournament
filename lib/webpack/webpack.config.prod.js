
const config = require('./webpack.config');
const webpack = require('webpack');

const copyStatic = require('./../etc/copy-static');
copyStatic(config.version);

config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    }
}));

config.plugins.push(new webpack.optimize.MinChunkSizePlugin({
    minChunkSize : 2000
}));

module.exports = config;
