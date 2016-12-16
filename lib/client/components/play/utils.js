import _ from 'lodash';

export const getPlayerPhoto = (player) => {
    const photos = player && (player.photos);
    return _.first(photos).value;
};