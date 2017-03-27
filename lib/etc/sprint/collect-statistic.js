/**
 * Created by drykovanov on 25.03.2017.
 */
import {ElasticStorage} from '../../server/game/elastic-storage';
import moment from 'moment';
import {calcStatistic} from '../../server/game/utils/sprint';
import _ from 'lodash';
let store = new ElasticStorage();

const calcStatus = async () => {
    const allDaysAttempts = await store.getAttemptsByDates({
        fromDate: moment().startOf('day'), toDate: moment().endOf('day')});
    return calcStatistic(allDaysAttempts);
};
calcStatus().then((results) => {
    console.log('Winners');
    results.order.forEach((playerInfo, indx) => {
        const tf = (time) => time.format('LT');
        console.log(`${indx+1} - ${playerInfo.playerId} : ${playerInfo.sum} / ${tf(playerInfo.startTime)}-${tf(playerInfo.finishTime)}`);
    });
});
