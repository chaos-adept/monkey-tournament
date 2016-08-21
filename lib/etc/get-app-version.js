var moment = require('moment');
const gitDescribeSync = require('git-describe').gitDescribeSync;

function getVersion() {
    const gitInfo = gitDescribeSync({
        longSemver: true,
        match: "[0-9]*.[0-9]*.[0-9]**"
    });

    const appVersion = {
        buildVersion: gitInfo.raw,
        buildTime: moment().format('YYYY-MM-DDThh:MM:ss±hh'),
        gitInfo: gitInfo
    };

    return appVersion;
}

module.exports = getVersion;

