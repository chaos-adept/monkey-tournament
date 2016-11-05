import {RedisDailyPlayerScores} from '../game/redis-dailly-scores';
let should = require('chai').should();
let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-fuzzy'));
chai.use(require('chai-datetime'));
import moment from 'moment';


describe('redis daily stores', () => {

    let scores;
    beforeEach(async() => {
        scores = new RedisDailyPlayerScores('ut-d');

        await Promise.all([
            scores.incByDay('1', 1, moment()),
            scores.incByDay('1', 3, moment().subtract(1, 'd')),
            scores.incByDay('2', 2,  moment()),
            scores.incByDay('3', 12, moment().add(1, 'd'))
        ]);

    });

    afterEach(async() => {
        return scores.remove();
    });


    it("should collect for today", async () => {
        const [top1, top2] = await scores.getTopPlayers(3, moment());
        top1.playerId.should.eq("2");
        top2.playerId.should.eq("1");
    });

});