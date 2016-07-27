import {startServer} from './../server';
import Promise from 'bluebird';
var fs = require("fs");
var path = require('path');
let expect = require('chai').expect;
var request = require('superagent');
var baseHttpPort = 5000;
var indexHtmlFile = path.resolve(__dirname, '../../static/login.html');
var socketIOClientFile = path.resolve(__dirname, '../../node_modules/socket.io-client/socket.io.js');

var options ={
    transports: ['websocket'],
    'force new connection': true
};


describe("Chat Server", function () {
	this.timeout(10000);

    let httpPort;
    let localServerUrl;
    let server;
    let localServerSocketIOClientUrl;
    let localServerLoginUrl;

    beforeEach(() => {
        httpPort = baseHttpPort;
        localServerUrl = `http://localhost:${httpPort}`;
        localServerSocketIOClientUrl = `http://localhost:${httpPort}/socket.io/socket.io.js`;
        localServerLoginUrl = `http://localhost:${httpPort}/login`;
        server = startServer({httpPort});
    });

    afterEach(() => {
        server.shutdown();
    });

    const makeSocket = () => {
        const io = require('socket.io-client');
        const socket = io(localServerUrl, options);
        return socket;
    };

    it("should provide index html", () => {
        return request('GET', localServerUrl).then((result) => {
            const readFilePromise = Promise.promisify(fs.readFile);
            return readFilePromise(indexHtmlFile, "utf8").then((data) => {
                result.text.should.eq(data);
            });
        });
    });

    it.only("should authorize user", () => {
        return request.post(`${localServerUrl}/login`)
            .type('form')
            .send({ username: 'jack'}).send({password: 'secret'})
            .then((result) => {
                result.text.should.eq(1);
            });
    });

    it.skip("should provide socket.io client", () => {
        return request('GET', localServerSocketIOClientUrl).then((result) => {
            console.dir(result);
            const readFilePromise = Promise.promisify(fs.readFile);
            return readFilePromise(socketIOClientFile, "utf8").then((data) => {
                result.text.should.eq(data);
            });
        });
    });

    it('Should connect a user over socket', (done) => {
        const socket = makeSocket();
        socket.on('event', function(data){});
        socket.on('disconnect', function(){});
        socket.on('connect', function(){
            socket.disconnect();
            done();
        });
    });

    it('should send echo command', (done) => {
        const socket = makeSocket();
        const echoData = { value: 10.11 };

        socket.on('connect', function(data) {
            socket.emit('echo', echoData);
        });
        socket.on('echo', function(data){
            data.should.like(echoData);
            done();
        });
    });

    const register = (socket, playerId) => {
        socket.on('connect', function() {
            socket.emit('register', playerId);
        });
    };

    const makeTurn = (socket, turn) => {
        socket.emit('turn', turn);
    };

    const makeTurnsOnWelcome = (socket, turns) => {
        socket.on('welcome', () => {
            turns.forEach( (turn) => makeTurn(socket, turn));
        });
    };

    it('should register socket as player with name', (done) => {
        const socket = makeSocket();
        register(socket, 'playerId1');
        socket.on('welcome', (playerId) => { playerId.should.eq('playerId1');  done(); });
    });

    it('should collect turn from registered player', (done) => {
        const expectedPlayerId = 'playerId1';
        const value = 1;
        const socket = makeSocket();
        const expectedTurnHash = 0;
        register(socket, expectedPlayerId);

        makeTurnsOnWelcome(socket, [{ value, turnHash: expectedTurnHash }]);

        socket.on('turn', ({playerId, value, turnHash}) => {
            playerId.should.eq(playerId);
            value.should.eq(value);
            expectedTurnHash.should.eq(turnHash);
            done();
        });
    });

    it('should send updates scores after turns with sum', (done) => {
        const player1 = { socket:makeSocket(), id: 'player1', turns: [{ value:2 }, { value:1 }] };
        const player2 = { socket:makeSocket(), id: 'player2', turns: [{ value:3 }, { value:4 }] };
        const allTurns = [ ...player1.turns, ...player2.turns ];
        register(player1.socket, player1.id);
        register(player2.socket, player2.id);

        makeTurnsOnWelcome(player1.socket, player1.turns);
        makeTurnsOnWelcome(player2.socket, player2.turns);

        var scoresActualCalls = 0;
        player1.socket.on('scores', (scores) => {
            expect(scores).to.be.defined;
            scoresActualCalls++;
            if (scoresActualCalls == allTurns.length) {
                const [topPlayer, secondPlayer] = scores;
                topPlayer.playerId.should.eq(player2.id);
                // secondPlayer.playerId.should.eq(player1.id);
                done();
            }
        });

    });
});