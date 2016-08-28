import {RedisPlayerScores} from '../game/redis-player-scores';
let should = require('chai').should();
let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-fuzzy'));
chai.use(require('chai-datetime'));


describe('redis score stores', () => {

    let scores;
    beforeEach(async () => {
        scores = new RedisPlayerScores('unit-test');

        await Promise.all([
            scores.incPlayer('1', 1),
            scores.incPlayer('1', 3),
            scores.incPlayer('2', 2),
            scores.incPlayer('3', 12)
        ]);

    });

    afterEach(async() => {
        return scores.remove();
    });

    it('collect turns', async () => {
        const result1 = await scores.getPlayerResults(1);
        const result2 = await scores.getPlayerResults(2);
        result1.score.should.eq(4);
        result1.rank.should.eq(1);

        result2.score.should.eq(2);
        result2.rank.should.eq(2);
    });
    it('get top results', async() => {
        const [player1, player2] = await scores.getTopPlayers(2);
        player1.playerId.should.eq('3');
        player1.score.should.eq(12);
        player1.rank.should.eq(0);
        player2.playerId.should.eq('1');
        player2.score.should.eq(4);
        player2.rank.should.eq(1);
    });
});