import _ from 'lodash';

export const calcPlayerScoreDiff = (playerId, prevScores, currentScores) => {

    const prevMap = _.keyBy(prevScores, 'player.id');
    const currMap = _.keyBy(currentScores, 'player.id');

    const defaultScore = { result:{ day: { score: 0, rank: Number.NaN } } };
    const { result: { day: playerPrev } } = prevMap[playerId] || defaultScore;
    const { result:{ day: playerCurr } } = currMap[playerId] || defaultScore;

    const scoreDiff = playerCurr.score - playerPrev.score;
    const rankDiff = -(playerCurr.rank - playerPrev.rank);

    return {score: scoreDiff, rank: rankDiff};
};