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

        it('should collect turns', async () => {
            //when
            const turn = {playerId, value: 1};
            await game.makeTurn(turn);

            //then
            (await game.getPlayerResults(playerId)).score.should.eq(1);
        });

        it('should track top player', async () => {
            const strongPlayer = 'strongPlayer';
            const weakPlayer = 'weakPlayer';

            await game.makeTurn({playerId: weakPlayer, value:3});
            await game.makeTurn({playerId: strongPlayer, value:4});
            await game.makeTurn({playerId: 'unknown', value:1});

            const [topPlayerResults, weakPlayerResults, unknown] = await game.getTopPlayers(2);

            expect(unknown).to.be.undefined;
            topPlayerResults.playerId.should.eq(strongPlayer);
            topPlayerResults.score.should.eq(4);
            weakPlayerResults.playerId.should.eq(weakPlayer);
            weakPlayerResults.score.should.eq(3);
        });
    });
});