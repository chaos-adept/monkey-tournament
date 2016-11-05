import {calcPlayerScoreDiff} from './score-diff-utils';
import moment from 'moment';

let should = require('chai').should();
let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-fuzzy'));
chai.use(require('chai-datetime'));

describe('Score Diff Calculation', () => {
    it("should calculate diff based on other player scores", () => {
        const playerId = 'p1';
        const prevScore = [{
            "player": {
                "id": "p1"
            },
            "result": {
                "day": {"score": 5, "rank": 2},
            }
        }];
        const currentScore = [{
            "player": {
                "id": "p1"
            },
            "result": {
                "day": {"score": 2, "rank": 5},
            }
        }];
        const expected = { score: -3, rank: -3 };

        const actual = calcPlayerScoreDiff(playerId, prevScore, currentScore);

        actual.should.like(expected);

    });
});