/**
 * Created by drykovanov on 27.03.2017.
 */
import moment from 'moment';
import _ from 'lodash';

export const calcStatistic = (attempts, limitMinutes) => {
    const sortedAttempts = _.orderBy(attempts, 'time');
    const playerInfos = new Map();

    const collectAttempt = (attempt) => {
        const playerId = attempt.playerId;
        let playerInfo = playerInfos.get(playerId);
        if (!playerInfo) {
            playerInfo = { playerId, allAttempts: [attempt]};
            playerInfos.set(playerId, playerInfo);
        } else {
            playerInfo.allAttempts.push(attempt);
        }

        const isInitSprintAttempt = !(playerInfo.initAttempt) && (attempt.value === 1);
        const isSprintAttempt = playerInfo.initAttempt && (attempt.time.isSameOrAfter(playerInfo.startTime) &&
            attempt.time.isSameOrBefore(playerInfo.finishTime));

        if (isInitSprintAttempt) {
            playerInfo.initAttempt = attempt;
            playerInfo.attempts = [attempt];
            playerInfo.startTime = attempt.time;
            playerInfo.finishTime = attempt.time.clone();
            playerInfo.finishTime.add(limitMinutes, 'm');
        } else if (isSprintAttempt) {
            playerInfo.attempts.push(attempt);
        }
    };

    sortedAttempts.forEach(collectAttempt);
    for (let playerInfo of playerInfos.values()) {
        playerInfo.sum = _.sumBy(playerInfo.attempts, 'value')
    }
    const order = _.sortBy([...playerInfos.values()], 'sum').reverse();
    return { players: playerInfos, order };
};
