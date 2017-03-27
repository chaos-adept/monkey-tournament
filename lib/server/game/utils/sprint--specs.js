/**
 * Created by drykovanov on 27.03.2017.
 */
import moment from 'moment';
import {calcStatistic} from './sprint';

describe('sprint specs', () => {
   const sprintMinutesLimit = 30;
   const attempts = [
       { playerId: 'batman', value: 1, time: moment() },
       { playerId: 'batman', value: 2, time: moment() },

       { playerId: 'superman', value: 2, time: moment() , id: 'ignoredNonCorrectMarker' },
       { playerId: 'superman', value: 1, time: moment() , id: 'start' },
       { playerId: 'superman', value: 2, time: moment() },
       { playerId: 'superman', value: 2, time: moment() },
       { playerId: 'superman', value: 1, time: moment() },
       { playerId: 'superman', value: 10, time: moment().add(sprintMinutesLimit+1, 'minutes') , id: 'outOfTime'},

   ];

    const statistic = calcStatistic(attempts, sprintMinutesLimit);

   it('should find winners', () => {
       const [winner, second] = statistic.order;
       winner.playerId.should.be.eq('superman');
       second.playerId.should.be.eq('batman');
   });

   it('should collect all attempts', () => {
       const superman = statistic.players.get('superman');
       superman.allAttempts.length.should.eq(6);
   });

   it('should collect start attempt', () => {
      const superman = statistic.players.get('superman');
      superman.initAttempt.id.should.eq('start');
      superman.startTime.should.be.not.undefined;
      superman.finishTime.should.be.not.undefined;
   });

    it('should collect in sprint attempt', () => {
        const superman = statistic.players.get('superman');
        superman.attempts.length.should.eq(4);
    });
});