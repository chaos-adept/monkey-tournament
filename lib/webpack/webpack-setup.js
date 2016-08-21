/**
 * Created by drykovanov on 8/21/2016.
 */
import config from './webpack.config';
import express from 'express';
import getStatic from './../etc/get-static';
var path = require('path');

export const addWebPackCompiler = (app) => {
    const webpack = require('webpack'),
        webpackDevMiddleware = require('webpack-dev-middleware'),
        webpackHotMiddleware = require('webpack-hot-middleware'),
        webpackcompiler = webpack(config);


    console.log(config);
    if (process.env.NODE_ENV === 'production') {
        const serveStatic = require('serve-static');
        app.use('/', serveStatic(path.resolve(__dirname, './../../client'), {'index': ['index.html', 'index.htm']}));
        app.use('/client', serveStatic(path.resolve(__dirname, './../../client'), {'index': ['index.html', 'index.htm']}))
    } else {
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
        const staticHtml = getStatic(config.version);
        let getIndex = function(req, res) { res.send(staticHtml.index)};

        app.get('/', getIndex);
        app.use('/index.html', getIndex);
    }



    return app;
};

