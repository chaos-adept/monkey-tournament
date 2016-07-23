

export const startServer = ({httpPort}) => {
    var io = require('socket.io').listen(httpPort);

    io.sockets.on('connection', function (socket) {
        console.log('connection');
    });

    // var app = require('express')();
    // var server = require('http').createServer(app);
    // var io = require('socket.io')(server);
    // io.on('connection', function(){ /* … */ });
    // server.listen(httpPort);


    // server.listen(httpPort);
    //console.log(httpPort);
    const shutdown = () => {
        io.close();
    };

    return { shutdown }
};

