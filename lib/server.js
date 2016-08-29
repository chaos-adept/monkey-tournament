import path from 'path';
import {DeadMatch, DailyPlayerScores} from './game/dead-match';
import {RedisPlayerScores} from './game/redis-player-scores';
import {RedisDailyPlayerScores} from './game/redis-dailly-scores';
import {addAuthSupport} from './auth/auth';
import moment from 'moment';
import {findUserByIdsPromise} from './auth/users';

import {addWebPackCompiler} from './webpack/webpack-setup';

export const startServer = ({httpPort, httpHost = '127.0.0.1'}) => {
    const express = require('express');
    const app = express();
    const server = require('http').createServer(app);
    const io = require('socket.io')(server);
    const game = new DeadMatch(new RedisPlayerScores("dead-match-scores"), new RedisDailyPlayerScores("dead-match-scores"));
    const topScoresNum = 50;
    const getPlayerFromUser = (user) => ({
        id: user.id,
        profileUrl: user.profile.profileUrl,
        displayName: user.profile.displayName,
        photos: user.profile.photos
    });

    const getUpdateScores = async () => {
        const gameStats = await game.getGameStatsForDay(topScoresNum, moment());
        const mapScoreToUserId = (kind) => ({playerId, score}, indx) => (playerId);
        const playerIds = (gameStats.map( mapScoreToUserId('day') ));
        const users = await findUserByIdsPromise(playerIds);

        const results = await Promise.all(gameStats.map( async ({playerId, score, rank}, indx) => {
            const player = getPlayerFromUser(users[indx]);
            const day = { score, rank };
            const allTime = await game.getPlayerAlltimeResults(playerId) ;

            return {player, result:{day, allTime}};
        }));

        return results;

    };



    const updateScores = async () => {
        io.sockets.emit('scores', await getUpdateScores());
    };

    io.on('connection', async function(socket){
        console.log('connection');
        const user = socket.request.user;
        let playerId = socket.request.user.id;
        let player = getPlayerFromUser(user);


        socket.on('echo',function(data){
            socket.emit('echo', data);
        });
        socket.on('turn', async ({ value, turnHash }) => {
            await game.makeTurn({ playerId, value, time: moment() });
            socket.emit('turn', {playerId, value, turnHash});
            await updateScores(); //todo it should be wrapped to be called by throttle https://lodash.com/docs#throttle
        });

        socket.emit('welcome', player);
        await updateScores();

    });



    app.use('/socket.io/socket.io.js', express.static(path.resolve(__dirname, '../node_modules/socket.io-client/socket.io.js')));

    server.listen(httpPort, httpHost);
    addAuthSupport({app, io, httpPort, httpHost});

    const shutdown = () => {
        io.httpServer.close();
    };

    addWebPackCompiler(app);


    return { shutdown }
};

