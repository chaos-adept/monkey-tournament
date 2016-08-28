import {PlayerScores} from './dead-match';
import moment from 'moment';

let should = require('chai').should();
let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-fuzzy'));
chai.use(require('chai-datetime'));

class DaillyPlayerScores {
    constructor() {
        this.daysMap = new Map();
    }

    getKey(time) {
        return time.format('YYYY-MM-DD');
    }

    async incByDay(playerId, score, time) {
        const key = this.getKey(time);
        let scores = this.daysMap.get(key);
        if (!scores) {
            scores = new PlayerScores();
            this.daysMap.set(key, scores);
        }

        scores.incPlayer(playerId, score);
    }
    async getTopPlayers(topN, time) {
        const scores = this.daysMap.get(this.getKey(time));
        return scores ? scores.getTopPlayers(topN) : [];
    }
}

class DailyDeadMatch {
    constructor() {
        this.allTimeScores = new PlayerScores();
        this.dayScores = new DaillyPlayerScores();
    }

    async makeTurn({playerId, score, time}) {
        return Promise.all([
            this.allTimeScores.incPlayer(playerId, score),
            this.dayScores.incByDay(playerId, score, time)]);
    }

    async getTopPlayersByAllTime(topN) {
        return this.allTimeScores.getTopPlayers(topN);
    }

    async getPlayerResults(playerId) {
        return this.allTimeScores.getPlayerResults(playerId);
    }

    async getGameStatsForDay(topN, moment) {
        const allTimeScores = await this.allTimeScores.getTopPlayers(topN);
        const dayScores = await this.dayScores.getTopPlayers(topN, moment);
        return {
            allTimeScores,
            dayScores
        };
    }

    async remove() {
        await this.allTimeScores.remove();
        await this.dayScores.remove();
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

    afterEach(async() => {
       dailyDeadMatch.remove();
    });

    it("should collect attempts for all time", async() => {
        const [top1PlayerScore, top2PlayerScore] = await dailyDeadMatch.getTopPlayersByAllTime(2);

        top1PlayerScore.playerId.should.eq(top1Id);
        top2PlayerScore.playerId.should.eq(top2Id);
    });

    it("should get statistics for each category", async () => {
        const gameStats = await dailyDeadMatch.getGameStatsForDay(3, moment(todayDate));

        const [top1PlayerScore, top2PlayerScore] = gameStats.allTimeScores;
        top1PlayerScore.playerId.should.eq(top1Id);
        top2PlayerScore.playerId.should.eq(top2Id);

        const [dayTop1PlayerScore, dayTop2PlayerScore] = gameStats.dayScores;
        dayTop1PlayerScore.playerId.should.eq(dayTop1Id);
        dayTop2PlayerScore.playerId.should.eq(dayTop2Id);
    });

});