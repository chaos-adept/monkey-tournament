

export const startServer = ({httpPort}) => {


    var app = require('express')();
    var server = require('http').createServer(app);
    var io = require('socket.io')(server);
    io.on('connection', function(socket){
        socket.on('echo',function(data){
            io.sockets.emit('echo', data);
        });
    });
    server.listen(httpPort);
    const shutdown = () => {
        io.close();
    };

    return { shutdown }
};

