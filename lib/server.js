var path = require('path');

export const startServer = ({httpPort}) => {
    var express = require('express');
    var app = express();
    var server = require('http').createServer(app);
    var io = require('socket.io')(server);
    io.on('connection', function(socket){
        socket.on('echo',function(data){
            io.sockets.emit('echo', data);
        });
    });
    app.use('/', express.static(path.resolve(__dirname, '../static')));
    app.use('/socket.io/socket.io.js', express.static(path.resolve(__dirname, '../node_modules/socket.io-client/socket.io.js')));
    server.listen(httpPort);

    const shutdown = () => {
        io.httpServer.close();
    };

    return { shutdown }
};

