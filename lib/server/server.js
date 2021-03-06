import {DeadMatch, DailyPlayerScores, PlayerScores} from './game/dead-match';
import {RedisPlayerScores} from './game/redis-player-scores';
import {RedisDailyPlayerScores} from './game/redis-dailly-scores';
import {getPlayerFromUser, getUpdateScores} from './game/server-scores';
import {addAuthSupport} from './auth/auth';
import moment from 'moment';
import {ElasticStorage} from './game/elastic-storage';

import {addWebPackCompiler, addServeStatic} from './webpack/webpack-setup';



const setupGameWithRedisStore = () =>
    new DeadMatch(new ElasticStorage("dead-match-scores"), new RedisDailyPlayerScores("dead-match-scores"));
const setupGameWithInMemoryStore = () =>
    new DeadMatch(new PlayerScores(), new DailyPlayerScores());


const setupGame = (inMemory) => inMemory ? setupGameWithInMemoryStore() : setupGameWithRedisStore();

export const startServer = ({httpPort, httpHost = '127.0.0.1', inMemory = false}) => {
    const express = require('express');
    const fs = require('fs');
    const app = express();
    const game = setupGame(inMemory);

    const privateKeyPath = process.env.CERT_PRIVATE_KEY || './etc/localhost-cert/localhost.server.key';
    const publicKeyPath = process.env.CERT_PUBLIC_KEY || './etc/localhost-cert/localhost.server.crt';

    const privateKey = fs.readFileSync(privateKeyPath).toString();
    const certificate = fs.readFileSync(publicKeyPath).toString();

    const options = {
        key : privateKey,
        cert : certificate
    };
    const https = require('https');
    const server = https.createServer(options, app);
    const io = require('socket.io')(server);



    const updateScores = async () => {
        console.log("update scores");
        try {
            //todo optimize it, it is not efficient , because update scores cant pre-cache players
            const todayScores = await getUpdateScores(game);
            const dayAgo = moment().subtract(1, 'days');
            const yesterdayScores = await getUpdateScores(game, dayAgo);
            const twoDaysAgo = moment().subtract(2, 'days');
            const twoDaysAgoScores = await getUpdateScores(game, twoDaysAgo);

            const scores = { today: todayScores, yesterday: yesterdayScores, twoDaysAgo:twoDaysAgoScores };

            io.sockets.emit('scores', scores);
        } catch (e) {
            console.error(e);
        }
    };

    io.on('connection', async function(socket){
        const user = socket.request.user;
        let playerId = socket.request.user.id;
        let player = getPlayerFromUser(user);

        socket.on('echo',function(data){
            socket.emit('echo', data);
        });
        socket.on('turn', async ({ value, clan, turnHash, location }) => {
            await game.makeTurn({ playerId, value, clan, location, time: moment() });
            socket.emit('turn', {playerId, value, clan, turnHash});
            //todo remove it, after connection client should resync data by himself
            await updateScores();
        });

        socket.emit('welcome', player);
        await updateScores();
    });

    let listenHandler = server.listen(httpPort, httpHost);
    addAuthSupport({app, io, httpPort, httpHost});

    const shutdown = (terminateProcess = true) => {
        process.nextTick(() => {
            listenHandler.close();
            io.httpServer.close();
            terminateProcess && process.exit(0);
        })

    };

    const cleanData = async () => {
        return game.remove()
    };

    app.use('/shutdown', function(req, res){
        if (['localhost', '127.0.0.1'].includes(req.ip)) {
            console.log(`shutdown from ${req.ip}`);
            res.send('bye');
            shutdown();
        } else {
            console.log(`tried shutdown from ${req.ip}`);
            res.send('operation is not allowed');
        }
    });

    if (process.env.NODE_ENV === 'production') {
        addServeStatic(app);
    } else {
        addWebPackCompiler(app);
    }

    return { shutdown, cleanData }
};

