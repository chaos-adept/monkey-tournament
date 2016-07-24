import path from 'path';
import DeadMatchGame from './game/dead-match';

export const startServer = ({httpPort}) => {
    const express = require('express');
    const app = express();
    const server = require('http').createServer(app);
    const io = require('socket.io')(server);
    const game = new DeadMatchGame();
    const onlineList = new Map();
    const topScoresNum = 50;

    io.on('connection', function(socket){
        socket.on('echo',function(data){
            socket.emit('echo', data);
        });
        socket.on('register', (playerId) => {
            onlineList[socket] = { playerId };
            socket.emit('welcome', playerId);
        });
        socket.on('turn', ({ value, turnHash }) => {
            const playerId = onlineList[socket].playerId;
            game.makeTurn({ playerId, value });
            socket.emit('turn', {playerId, value, turnHash});
            updateScores(); //todo it should be wrapped to be called by throttle https://lodash.com/docs#throttle
        });
    });

    const updateScores = () => {
        io.sockets.emit('scores', game.getTopPlayers(topScoresNum));
    };

    app.use('/', express.static(path.resolve(__dirname, '../static')));
    app.use('/socket.io/socket.io.js', express.static(path.resolve(__dirname, '../node_modules/socket.io-client/socket.io.js')));
    server.listen(httpPort);

    const shutdown = () => {
        io.httpServer.close();
    };

    return { shutdown }
};

