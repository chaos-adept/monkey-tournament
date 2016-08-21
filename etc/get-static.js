var path = require('path');
var fs = require('fs');
var _ = require('lodash');

module.exports = function (version) {
    var index = fs.readFileSync(path.resolve(__dirname, '../static/index.html'), 'utf-8');

    var indexTemplate = _.template(index);

    return {
        index: indexTemplate({version: version}),
    }
};