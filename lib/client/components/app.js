import React from 'react';
import {Router, Route, IndexRoute, Link, IndexLink, browserHistory} from 'react-router';
const ACTIVE = {color: 'blue'};

export class App extends React.Component {
    render() {
        return <div>
            <h1>Monkey Bar Game</h1>
            <ul>
                <li><Link to="/" activeStyle={ACTIVE}>home</Link></li>
                <li><Link to="/play" activeStyle={ACTIVE}>play</Link></li>
                <li><Link to={{pathname: '/profile/current', query: {foo: 'bar'}}}
                          activeStyle={ACTIVE}>profile</Link></li>
                <li><a href="/logout">/logout</a></li>
            </ul>
            {this.props.children}
        </div>
    }

}