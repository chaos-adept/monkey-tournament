import {startServer} from './../server';

var request = require('superagent');
const httpPort = 3000;

const localServerUrl = `http://localhost:${httpPort}`;
var options ={
    transports: ['websocket'],
    'force new connection': true
};


describe("Chat Server", function () {
	this.timeout(10000);

    let server;
    beforeEach(() => {
        server = startServer({httpPort});
    });

    afterEach(() => {
        server.shutdown();
    });

	/*
    it("should provide index html", () => {
        return request('GET', localServerUrl).then((result) => {
            result.text.should.eq('<h1>Hello world</h1>');
        });
    });
	*/

    it('Should connect a user over socket', (done) => {
        const io = require('socket.io-client');
        const socket = io(localServerUrl, options);
        socket.on('event', function(data){});
        socket.on('disconnect', function(){});
        socket.on('connect', function(){
            socket.disconnect();
            done();
        });
    });

    it('should send echo command', (done) => {
        const io = require('socket.io-client');
        const socket = io(localServerUrl);
        const echoData = { value: 10.11 };

        socket.on('connect', function(data) {
            socket.emit('echo', echoData);
        });
        socket.on('echo', function(data){
            data.should.like(echoData);
            done();
        });

    });
});