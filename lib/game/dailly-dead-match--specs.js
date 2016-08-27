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
        this.dayScores = new PlayerScores();
    }

    async makeTurn({playerId, value, time}) {
        const todayStart = moment().startOf('day');
        const isToday = time.isSameOrAfter(todayStart); //todo what about tomorrow?
        if (!isToday) {
            return [this.allTimeScores.incPlayer(playerId, value)];
        } else {
            return Promise.all([
                this.allTimeScores.incPlayer(playerId, value),
                this.dayScores.incPlayer(playerId, value)]);
        }
    }

    async getTopPlayersByAllTime(topN) {
        return this.allTimeScores.getTopPlayers(topN);
    }

    async getPlayerResults(playerId) {
        return this.allTimeScores.getPlayerResults(playerId);
    }

    async getTopPlayersByToday(topN) {
        return this.dayScores.getTopPlayers(topN);
    }

    async getGameStatsForDay(topN, moment) {
        return {
            allTimeScores: await this.allTimeScores.getTopPlayers(topN),
            dayScores: await this.dayScores.getTopPlayers(topN, moment)
        };
    }
}

describe('daily dead match', () => {
    const top1Id = "p1";
    const top2Id = "p2";

    const dayTop1Id = "p3";
    const dayTop2Id = "p4";
    const todayDate = "1995-12-25";

    let dailyDeadMatch;
    beforeEach(async() => {
        dailyDeadMatch = new DailyDeadMatch();
        await dailyDeadMatch.makeTurn({playerId: "p1", value: 2, time: moment(todayDate).startOf('year')});
        await dailyDeadMatch.makeTurn({playerId: "p2", value: 2, time: moment(todayDate).startOf('week')});
        await dailyDeadMatch.makeTurn({playerId: "p1", value: 3, time: moment(todayDate).subtract(1, 'days')});
        await dailyDeadMatch.makeTurn({playerId: "p3", value: 2, time: moment(todayDate).startOf('day')});
        await dailyDeadMatch.makeTurn({playerId: "p4", value: 1, time: moment(todayDate).startOf('day').add(1, 'hour')});
    });

    it("should collect attempts for all time", async() => {
        const [top1PlayerScore, top2PlayerScore] = await dailyDeadMatch.getTopPlayersByAllTime(2);

        top1PlayerScore.playerId.should.eq(top1Id);
        top2PlayerScore.playerId.should.eq(top2Id);
    });

    it("should collect attempts for day", async() => {
        const [top1PlayerScore, top2PlayerScore] = await dailyDeadMatch.getTopPlayersByToday(2);

        top1PlayerScore.playerId.should.eq(dayTop1Id);
        top2PlayerScore.playerId.should.eq(dayTop2Id);
    });

    it("should get statistics for each category", async () => {
        const gameStats = await dailyDeadMatch.getGameStatsForDay(3, moment(todayDate));

        const [top1PlayerScore, top2PlayerScore] = gameStats.allTimeScores;
        top1PlayerScore.playerId.should.eq(top1Id);
        top2PlayerScore.playerId.should.eq(top2Id);
    });

    it("should get stats for a day", async () => {
        const yesterday = moment(todayDate).subtract(1, 'd');
        const gameStats = await dailyDeadMatch.getGameStatsForDay(yesterday);


        gameStats.should.ok;

        const [top1PlayerScore, top2PlayerScore] = gameStats.allTimeScores;
        top1PlayerScore.playerId.should.eq(top1Id);
        top2PlayerScore.playerId.should.eq(top2Id);
    });

});