import {startServer} from './../server';
import Promise from 'bluebird';
var fs = require("fs");
var path = require('path');

var request = require('superagent');
var baseHttpPort = 3000;
var indexHtmlFile = path.resolve(__dirname, '../../static/index.html');

var options ={
    transports: ['websocket'],
    'force new connection': true
};


describe("Chat Server", function () {
	this.timeout(10000);

    let httpPort;
    let localServerUrl;
    let server;

    beforeEach(() => {
        httpPort = baseHttpPort++;
        localServerUrl = `http://localhost:${httpPort}`;
        server = startServer({httpPort});
    });

    afterEach(() => {
        server.shutdown();
    });

    it("should provide index html", () => {
        return request('GET', localServerUrl).then((result) => {
            const readFilePromise = Promise.promisify(fs.readFile);
            return readFilePromise(indexHtmlFile, "utf8").then((data) => {
                result.text.should.eq(data);
            });
        });
    });

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