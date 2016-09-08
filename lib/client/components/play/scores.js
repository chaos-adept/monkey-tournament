import React from 'react';
import _ from 'lodash';
import {PlayerIcon} from './player-icon';
import {ScoreDiff} from './score-diff';
import {Router, Route, IndexRoute, Link, IndexLink, browserHistory} from 'react-router';

export class Scores extends React.Component {
    static propTypes = {
        data: React.PropTypes.array.isRequired,
        prevData: React.PropTypes.array
    };

    render() {
        const scores = this.props.data;
        const prevData = this.props.prevData;

        return (
            <div className="col-xs-12 col-md-8">
                <ul className="media-list">
                    {scores && scores.map(it => {
                        return (
                            <li className="media" key={it.player.id}>
                                <div className="media-left media-middle">
                                    <div className="media-object">
                                        <PlayerIcon player={it.player} />
                                    </div>
                                </div>
                                <div className="media-body">
                                    <h4 className="media-heading">
                                        {it.player.displayName}
                                    </h4>
                                    <span><span className="badge">day: {it.result.day.score}</span></span>
                                    <span><ScoreDiff playerId={it.player.id} data={scores} prevData={prevData || []}/></span>
                                    <h5><span></span></h5>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

        )
    }
}
;
