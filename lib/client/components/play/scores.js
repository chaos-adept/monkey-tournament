import React from 'react';
import {PlayerIcon} from './player-icon';
import {Router, Route, IndexRoute, Link, IndexLink, browserHistory} from 'react-router';

export class Scores extends React.Component {
    static propTypes = {
        data: React.PropTypes.array.isRequired
    };

    render() {
        const scores = this.props.data;
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
                                    <div><div className="badge">day: {it.result.day.score}</div></div>
                                    <div><div className="badge">absolute: {it.result.allTime.score}</div></div>

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
