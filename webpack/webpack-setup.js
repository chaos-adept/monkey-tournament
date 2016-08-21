/**
 * Created by drykovanov on 8/21/2016.
 */
import config from './webpack.config';
import getStatic from '../etc/get-static';



export const addWebPackCompiler = (app) => {
    const webpack = require('webpack'),
        webpackDevMiddleware = require('webpack-dev-middleware'),
        webpackHotMiddleware = require('webpack-hot-middleware'),
        webpackcompiler = webpack(config);

    const staticHtml = getStatic(config.version);
    const getIndex = function(req, res) { res.send(staticHtml.index)};
    app.get('/', getIndex);
    app.use('/index.html', getIndex);
    console.log(config);
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

    return app;
};

