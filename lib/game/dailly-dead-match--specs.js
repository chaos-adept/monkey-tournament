import {PlayerScores} from './dead-match';
import moment from 'moment';

let should = require('chai').should();
let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-fuzzy'));
chai.use(require('chai-datetime'));

class DailyDeadMatch {
    constructor() {
        this.allTimeScores = new PlayerScores();
    }

    async makeTurn({playerId, value}) {
        return this.allTimeScores.incPlayer(playerId, value);
    }

    async getTopPlayersByAllTime(topN) {
        return this.allTimeScores.getTopPlayers(topN);
    }

    async getPlayerResults(playerId) {
        return this.allTimeScores.getPlayerResults(playerId);
    }
}

describe('daily dead match', () => {
    const top1Id = "p1";
    const top2Id = "p2";

    let dailyDeadMatch;
    beforeEach(async() => {
        dailyDeadMatch = new DailyDeadMatch();
        await dailyDeadMatch.makeTurn({playerId: "p1", value: 2, time: +moment().startOf('year')});
        await dailyDeadMatch.makeTurn({playerId: "p2", value: 2, time: +moment().startOf('week')});
        await dailyDeadMatch.makeTurn({playerId: "p1", value: 3, time: +moment().subtract(1, 'days')});
        await dailyDeadMatch.makeTurn({playerId: "p3", value: 1, time: +moment()});
    });

    it("it should collect attempts for all time", async() => {
        const [top1PlayerScore, top2PlayerScore] = await dailyDeadMatch.getTopPlayersByAllTime(2);

        top1PlayerScore.playerId.should.eq(top1Id);
        top2PlayerScore.playerId.should.eq(top2Id);
    });

    it("it should collect attempts for day", async() => {
        // const [top1PlayerScore, top2PlayerScore] = await dailyDeadMatch.getTopPlayersByToday(2);
        //
        // top1PlayerScore.playerId.should.eq(top1Id);
        // top2PlayerScore.playerId.should.eq(top2Id);
    });
});