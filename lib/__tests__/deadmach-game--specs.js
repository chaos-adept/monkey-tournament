'use strict';
let should = require('chai').should();
let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-fuzzy'));
chai.use(require('chai-datetime'));

const playerId = 1;
class DeadMatchGame {
    constructor() {
        this.players = new Map();
    }
    makeTurn(turn) {
        let playerResults = this.players.get(turn.playerId);

        if (!this.players.get(turn.playerId)) {
            playerResults = { playerId: turn.playerId , score: 0};
            this.players.set(turn.playerId, playerResults);
        }

        playerResults.score += turn.value;
    }
    getTopPlayers(topN) {
        return [...this.players.values()].sort((a, b) => b.score - a.score).slice(0, topN);
    }
    getPlayerResults(playerId) {
        return this.players.get(playerId);
    }
}


describe('dead mach', () => {
    describe('collect attempt results', () => {
        let game;

        beforeEach(() => {
            game = new DeadMatchGame();
        });

        it('should collect turns', () => {
            //when
            const startDate = new Date(Date.now() - 1);
            const turn = {playerId, value: 1};
            game.makeTurn(turn);

            //then
            game.getPlayerResults(playerId).score.should.eq(1);
        });

        it('should track top player', () => {
            const strongPlayer = 'strongPlayer';
            const weakPlayer = 'weakPlayer';

            game.makeTurn({playerId: weakPlayer, value:3});
            game.makeTurn({playerId: strongPlayer, value:4});
            game.makeTurn({playerId: 'unknown', value:1});

            const [topPlayerResults, weakPlayerResults, unknown] = game.getTopPlayers(2);

            expect(unknown).to.be.undefined;
            topPlayerResults.playerId.should.eq(strongPlayer);
            topPlayerResults.score.should.eq(4);
            weakPlayerResults.playerId.should.eq(weakPlayer);
            weakPlayerResults.score.should.eq(3);
        });
    });
});