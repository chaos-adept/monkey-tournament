import React from 'react';
import {Router, Route, IndexRoute, Link, IndexLink, browserHistory} from 'react-router';
const ACTIVE = {color: 'blue'};

export class App extends React.Component {
    render() {
        return <div>
            <div className = "container">
                <div className="row">
                    {this.props.children}
                </div>
            </div>
        </div>
    }

}