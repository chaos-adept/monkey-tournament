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
    server.listen(httpPort);

    const shutdown = () => {
        io.httpServer.close();
    };

    return { shutdown }
};

