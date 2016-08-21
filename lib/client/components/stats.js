import React from 'react';
import {Router, Route, IndexRoute, Link, IndexLink, browserHistory} from 'react-router';
const ACTIVE = {color: 'pink'};

export class Stats extends React.Component {
    render() {
        return (
            <div>
                <h2 style={ACTIVE}>Statistics</h2>
            </div>
        )
    }
}
;