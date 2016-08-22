import path from 'path';
import {DeadMatchGame, PlayerScores} from './game/dead-match';
import {RedisPlayerScores} from './game/redis-player-scores';
import {addAuthSupport} from './auth/auth';
import {findUserByIdsPromise} from './auth/users';

import {addWebPackCompiler} from './webpack/webpack-setup';

export const startServer = ({httpPort, httpHost = '127.0.0.1'}) => {
    const express = require('express');
    const app = express();
    const server = require('http').createServer(app);
    const io = require('socket.io')(server);
    const game = new DeadMatchGame(new RedisPlayerScores("dead-match-scores"));
    const topScoresNum = 50;
    const getPlayerFromUser = (user) => ({
        id: user.id,
        profileUrl: user.profile.profileUrl,
        displayName: user.profile.displayName,
        photos: user.profile.photos
    });

    io.on('connection', async function(socket){
        console.log('connection');
        const user = socket.request.user;
        let playerId = socket.request.user.id;
        let player = getPlayerFromUser(user);


        socket.emit('welcome', player);
        socket.emit('scores', await getUpdateScores());

        socket.on('echo',function(data){
            socket.emit('echo', data);
        });
        socket.on('turn', async ({ value, turnHash }) => {
            await game.makeTurn({ playerId, value });
            socket.emit('turn', {playerId, value, turnHash});
            await updateScores(); //todo it should be wrapped to be called by throttle https://lodash.com/docs#throttle
        });
    });

    const getUpdateScores = async () => {
        const topPlayersIds = await game.getTopPlayers(topScoresNum);
        const playerIds = topPlayersIds.map( ({playerId, scope}) => playerId );
        const users = await findUserByIdsPromise(playerIds);
        const results = topPlayersIds.map(({score}, indx) => {
            const player = getPlayerFromUser(users[indx]);
            return {player, score};
        });
        return results;
    };

    const updateScores = async () => {
        io.sockets.emit('scores', await getUpdateScores());
    };
    app.use('/socket.io/socket.io.js', express.static(path.resolve(__dirname, '../node_modules/socket.io-client/socket.io.js')));

    server.listen(httpPort, httpHost);
    addAuthSupport({app, io, httpPort, httpHost});

    const shutdown = () => {
        io.httpServer.close();
    };

    addWebPackCompiler(app);


    return { shutdown }
};

