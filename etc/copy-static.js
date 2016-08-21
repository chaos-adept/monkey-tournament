var fs = require('fs');
var path = require('path');
var getStatic = require('./get-static');

module.exports = function (version) {
    var filePath = path.resolve(__dirname, '../build/');
    var staticHtml = getStatic(version);
    var supportHtml = fs.readFileSync(path.resolve(__dirname, '../assets/support.html'), 'utf-8');

    fs.writeFile(filePath + '/index.html', staticHtml.index, function(err) {});
    fs.writeFile(filePath + '/support.html', supportHtml, function(err) {});
};
