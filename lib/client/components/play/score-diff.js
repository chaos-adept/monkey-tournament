import React from 'react';
import _ from 'lodash';
import {calcPlayerScoreDiff} from './score-diff-utils';

export class ScoreDiff extends React.Component {
    static propTypes = {
        playerId: React.PropTypes.string.isRequired,
        data: React.PropTypes.array.isRequired,
        prevData: React.PropTypes.array.isRequired
    };

    render() {
        const playerId = this.props.playerId;
        const scores = this.props.data;
        const prevData = this.props.prevData;
        const diff = calcPlayerScoreDiff(playerId, prevData, scores); //todo it should be pre-calculated

        const scoreClass = `label ${diff.score < 1 ? 'label-warning': 'label-success'}`;
        const rankClass = `label ${!diff.rank || (diff.rank < 0) ? 'label-warning': 'label-success'}`;

        return <span>
            <span className={scoreClass}>{diff.score}</span>
            <span className={rankClass}>{diff.rank}</span>
        </span>;
    }
};
