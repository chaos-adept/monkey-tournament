var commonConfig = require('./../webpack/webpack.config.js'),
    path = require('path');

commonConfig.root.push(path.resolve(__dirname, './../karma'));

commonConfig.module.loaders.unshift(
    {
        test: /\.((css)|(scss))$/,
        loaders: ['null-loader'],
    }
);

commonConfig.plugins.push(
    getWebpackKarmaWarningsPlugin()
);

const isCoverageEnabled = process.env.COVERAGE_ENABLED == 'true';

var karmaEntryPointPath = 'karma/karma-entry.js';

module.exports = function (config) {
    const baseConfigProps = {
        logLevel: config.LOG_DEBUG,
        client: {
            captureConsole: false,
        },
        basePath: './../',
        frameworks: ['mocha'],
        files: [
            './node_modules/phantomjs-polyfill/bind-polyfill.js',
            karmaEntryPointPath,
        ],
        plugins: [
            'karma-webpack',
            'karma-sourcemap-loader',
            'karma-mocha',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-spec-reporter',
            'karma-junit-reporter',
        ],
        browsers: ['Chrome'],
        preprocessors: {
            [karmaEntryPointPath]: ['webpack', 'sourcemap'],
        },
        reporters: ['spec', 'junit'],
        browserConsoleLogOptions: { level: 'debug', format: '%b %T: %m', terminal: true },
        // the default configuration
        junitReporter: {
            outputDir: 'build/reports/junit', // results will be saved as $outputDir/$browserName.xml
            outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile
            suite: '', // suite will become the package name attribute in xml testsuite element
            useBrowserName: true, // add browser name to report and classes names
            nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
            classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
        },
        specReporter: {
            maxLogLines: 15,         // limit number of lines logged per test
            suppressErrorSummary: true,  // do not print error summary
            suppressFailed: false,  // do not print information about failed tests
            suppressPassed: false,  // do not print information about passed tests
            suppressSkipped: false,  // do not print information about skipped tests
            showSpecTiming: true, // print the time elapsed for each spec
        },
        webpack: {
            noInfo: true,
            debug: false,
            devtool: 'inline-source-map',
            resolve: commonConfig.resolve,
            resolveLoader: commonConfig.resolveLoader,
            output: commonConfig.output,
            extensions: commonConfig.extensions,
            plugins: commonConfig.plugins,

            module: commonConfig.module,
        },
        webpackMiddleware: { noInfo: true },

    };

    var karmaConigProps = Object.assign({}, baseConfigProps);

    if (isCoverageEnabled) {

        karmaConigProps.plugins.push('karma-coverage', 'progress');

        // We use .unshift() for eslint-loader to work earlier.
        karmaConigProps.webpack.module.preLoaders.unshift({
            test: /\.js$/,
            include: path.resolve('./lib/client/'),
            exclude: path.resolve('./node_modules/'),
            loader: 'babel-istanbul',
            query: {
                cacheDirectory: true
                // see below for possible options
            }
        });

        karmaConigProps.reporters.push('coverage');

        karmaConigProps.coverageReporter = {
            reporters: [
                {
                    type: 'cobertura',
                    dir: 'build/reports/cobertura',
                    subdir: '.',
                },
                {
                    type: 'lcov',
                    dir: 'build/reports/coverage',
                    subdir: '.',
                },
            ]
        }
    }

    //console.log(JSON.stringify(karmaConigProps, undefined, 2));
    config.set(karmaConigProps);
};

// Plugin to show any webpack warnings and prevent tests from running
// taken from https://gist.github.com/mvgijssel/d3b121ad50e34c09a124
function getWebpackKarmaWarningsPlugin() {
    var WebpackKarmaWarningsPlugin = function () {
    };
    var RawSource = require('webpack/lib/RawSource');

    WebpackKarmaWarningsPlugin.prototype.apply = function (compiler) {
        compiler.plugin('compilation', function (compilation) {
            compilation.plugin('failed-module', function (module) {
                var moduleErrorMessage = module.error.error.toString();
                module._source = new RawSource(`throw new Error('${moduleErrorMessage}');`);
                module.error = null;
            });
        });
    };

    return WebpackKarmaWarningsPlugin;
}
