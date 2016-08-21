
import React from 'react';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
const ACTIVE = { color: 'blue' };

export const App = ({ children }) => {
    return <div>
        <h1>APP</h1>
        <ul>
            <li><Link to="/" activeStyle={ACTIVE}>/</Link></li>
            <li><IndexLink to="/" activeStyle={ACTIVE}>/ IndexLink</IndexLink></li>

            <li><Link to="/users" activeStyle={ACTIVE}>/users</Link></li>
            <li><IndexLink to="/users" activeStyle={ACTIVE}>/users IndexLink</IndexLink></li>

            <li><Link to="/users/ryan" activeStyle={ACTIVE}>/users/ryan</Link></li>
            <li><Link to={{pathname: '/users/ryan', query: {foo: 'bar'}}}
                      activeStyle={ACTIVE}>/users/ryan?foo=bar</Link></li>

            <li><Link to="/about" activeStyle={ACTIVE}>/about</Link></li>
        </ul>

        {children}
    </div>
};
