import path from 'path';
import DeadMatchGame from './game/dead-match';
import {addAuthSupport} from './auth/auth';

export const startServer = ({httpPort}) => {
    const express = require('express');
    const app = express();
    const server = require('http').createServer(app);
    const io = require('socket.io')(server);
    const game = new DeadMatchGame();
    const topScoresNum = 50;



    io.on('connection', function(socket){
        console.log('socket user', socket.request.user);
        const user = socket.request.user;
        const publicUserData = { id: user.id, profileUrl:user.profile.profileUrl, displayName: user.profile.displayName, photos: user.profile.photos };
        let playerId = socket.request.user.id;

        socket.emit('welcome', publicUserData);
        socket.on('echo',function(data){
            socket.emit('echo', data);
        });
        socket.on('turn', ({ value, turnHash }) => {
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

    addAuthSupport(app, io);

    server.listen(httpPort);

    const shutdown = () => {
        io.httpServer.close();
    };

    return { shutdown }
};

