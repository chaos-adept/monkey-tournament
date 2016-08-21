var fs = require('fs');
var path = require('path');
var getStatic = require('./get-static');

module.exports = function (version) {
    var filePath = path.resolve(__dirname, './../../build/client');
    console.log(filePath);
    var staticHtml = getStatic(version);

    fs.writeFile(filePath + '/index.html', staticHtml.index, function(err) {});
};
