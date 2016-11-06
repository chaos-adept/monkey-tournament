/**
 * Created by drykovanov on 8/21/2016.
 */

var path = require('path');

export const addServeStatic = (app) => {
    const serveStatic = require('serve-static');
    const clientStaticPath = './../../client';
    app.use('/', serveStatic(path.resolve(__dirname, clientStaticPath), {'index': ['index.html', 'index.htm']}));
    app.use('/client', serveStatic(path.resolve(__dirname, clientStaticPath), {'index': ['index.html', 'index.htm']}))
    app.get('*', function (request, response){
        response.sendFile(path.resolve(__dirname, clientStaticPath, 'index.html'))
    })
};

export const addWebPackCompiler = (app) => {
    const webpack = require('webpack'),
        config = require('./../../webpack/webpack.config'),
        webpackDevMiddleware = require('webpack-dev-middleware'),
        webpackHotMiddleware = require('webpack-hot-middleware'),
        webpackcompiler = webpack(config);


        /* webpack */
        app.use(webpackDevMiddleware(webpackcompiler, {
            publicPath: config.output.publicPath,
            stats: {
                colors: true,
                chunks: false, // this reduces the amount of stuff I see in my terminal; configure to your needs
                'errors-only': false
            }
        }));
        app.use(webpackHotMiddleware(webpackcompiler, {
            log: console.log
        }));

        //index
        const getStatic = require('./../../etc/get-static');
        const staticHtml = getStatic(config.version);
        let getIndex = function(req, res) { res.send(staticHtml.index)};

        app.use('/', getIndex);
        app.use('/index.html', getIndex);
        app.use('*', getIndex);

    return app;
};

