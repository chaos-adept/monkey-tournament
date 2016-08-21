var getVersion = require('./get-app-version');
var fs = require('fs');

var fullVersion = getVersion();
var version = fullVersion.buildVersion;

const False = 'false';

var args = require('optimist')
    .default({
        file: null,
        short: False
    })
    .argv;

if (args.file) {
    fs.writeFile(args.file, version, function(err) {});
    console.info(`'${version}' was copied into ${args.file}`);
} else {
    var toClipboard = require('to-clipboard');
    toClipboard.sync( version );
    console.info(`'${version}' was copied into clipboard`);
}

if (args.short === False) {
    console.info('full version info below:');
    console.dir(fullVersion);
}
