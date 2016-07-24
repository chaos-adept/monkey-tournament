'use strict';
let should = require('chai').should();
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

            game.makeTurn({playerId: weakPlayer, value:1});
            game.makeTurn({playerId: strongPlayer, value:2});

            const [topPlayerResults, weakPlayerResults] = game.getTopPlayers(2);

            topPlayerResults.playerId.should.eq(strongPlayer);
            weakPlayerResults.playerId.should.eq(weakPlayer);
        });
    });
});