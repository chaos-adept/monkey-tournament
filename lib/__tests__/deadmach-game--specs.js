'use strict';
import {DeadMatchGame, PlayerScores} from '../game/dead-match'
let should = require('chai').should();
let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-fuzzy'));
chai.use(require('chai-datetime'));

const playerId = 1;


describe('dead mach', () => {
    describe('collect attempt results', () => {
        let game;

        beforeEach(() => {
            game = new DeadMatchGame(new PlayerScores());
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