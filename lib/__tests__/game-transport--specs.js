import {startServer} from './../server';

var request = require('superagent');
const port = 3000;
const localServerUrl = `http://localhost:${port}/`;
describe("Chat Server", function () {
    let server;
    beforeEach(() => {
        server = startServer({port});
    });

    it("should provide index html", () => {
        return request('GET', localServerUrl).then((result) => {
            result.text.should.eq('<h1>Hello world</h1>');
        });
    });

    afterEach(() => {
        server.shutdown();
    });

    it('Should broadcast new user to all users', () => {

    });
});