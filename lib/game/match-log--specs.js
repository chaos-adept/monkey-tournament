let should = require('chai').should();
let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-fuzzy'));
chai.use(require('chai-datetime'));

describe('match log', () => {
    it("should get list of attempt in the time range", () => {
        //given attempt
        const startTime = 1;
        const endTime = 12;
        const attempt1 = { value:1, time:12, lat: 10, long: 10 };
        const attempt2 = { value:2, time:13, lat: 10, long: 10 };
        const attempts = [];
        const logAttempt = (attepmt) => { attempts.push(attepmt); };
        const getAttempts = ({startTime, endTime}) => attempts.filter(({time}) => time >= startTime && time <= endTime);

        //when
        logAttempt(attempt1);
        logAttempt(attempt2);

        //then
        const actualAttempts = getAttempts({startTime, endTime});

        actualAttempts.should.containOneLike(attempt1);
        actualAttempts.should.not.containOneLike(attempt2);
    });
});