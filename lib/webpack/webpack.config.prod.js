
const config = require('./webpack.config.js');

const copyStatic = require('./../etc/copy-static');
copyStatic(config.version);

module.exports = config;
