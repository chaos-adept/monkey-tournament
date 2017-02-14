import chai from 'chai';
import _ from 'lodash';

chai.should();

describe('daily attempts', () => {

    const attempt = (value, offsetMs) => ({value, offsetMs});
    const calcSpeed = (attempts) => {
        if (_.isEmpty(attempts)) {
            return 0;
        }

        const firstAttempt = attempts.shift();
        const sumTime = _.sumBy(attempts, 'offsetMs');
        const sumValue = _.sumBy(attempts, 'value') + firstAttempt.value;

        return (sumValue / sumTime);
    };


    it('should calc speed', () => {
        //given
        const attempts = [attempt(10, 1), attempt(5, 3), attempt(5, 2)];
        const expectedSpeed = (10 + 5 + 5) / ((2 + 3));
        //when
        const speed = calcSpeed(attempts);
        //then
        speed.should.eq(expectedSpeed);
    });
});