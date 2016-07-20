'use strict';
let should = require('chai').should();
let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-fuzzy'));
chai.use(require('chai-datetime'));

const playerId = 1;
class Game {
    constructor() {
        this.turns = [];
    }

    makeTurn(turn) {
        this.turns.push({...turn, ...{date: new Date()}});
    }
    turnsCount() {
        return this.turns.length;
    }
    getTurns() {
        return this.turns;
    }
}


describe('basic game flows', () => {
    describe('collect attempt results', () => {
        let game;

        beforeEach(() => {
            game = new Game();
        });

        it('should collect turns', () => {
            //when
            const startDate = new Date(Date.now() - 1);
            const turn = {playerId, value: 1};
            game.turnsCount().should.eq(0);
            game.makeTurn(turn);

            //then
            game.turnsCount().should.eq(1);
            const actualTurn = game.getTurns()[0];
            actualTurn.playerId.should.eq(playerId);
            actualTurn.value.should.eq(turn.value);
            actualTurn.date.should.afterTime(startDate);
            actualTurn.date.should.beforeTime(new Date(Date.now()));
        });
    });
});