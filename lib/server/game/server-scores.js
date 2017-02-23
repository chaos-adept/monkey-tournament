import {findUserByIdsPromise} from '../auth/users';
import moment from 'moment';

const topScoresNum = 50;

//non transport functions
export const getPlayerFromUser = (user) => ({
    id: user.id,
    profileUrl: user.profile.profileUrl,
    displayName: user.profile.displayName,
    photos: user.profile.photos
});

export const getUpdateScores = async (game, atMoment = moment()) => {
    const dayScores = await game.getGameStatsForDay(topScoresNum, atMoment);
    const mapScoreToUserId = ({playerId, score}, indx) => (playerId);
    const playerIds = dayScores.map( mapScoreToUserId );
    const users = await findUserByIdsPromise(playerIds);

    const results = await Promise.all(dayScores.map( async ({playerId, score, rank}, indx) => {
        const player = getPlayerFromUser(users[indx]);
        const day = { score, rank };

        return {player, result:{day}};
    }));

    return results;
};