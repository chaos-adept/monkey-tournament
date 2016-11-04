var fs = require('fs');
var path = require('path');
var bluebird = require('bluebird');
var getStatic = require('./get-static');
var writeFile = bluebird.promisify(fs.writeFile);
var mkdir = bluebird.promisify(fs.mkdir);

module.exports = function (version) {
    var filePath = path.resolve(__dirname, './../../build/client');
    console.log(filePath);
    var staticHtml = getStatic(version);

    return mkdir(filePath)
            .then(writeFile(filePath + '/index.html', staticHtml.index));
};
