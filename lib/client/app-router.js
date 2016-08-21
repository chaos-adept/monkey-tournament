import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'

import { App } from './components/app';    
import { Index } from './components/index';

export default class GameRouter extends React.Component {
    render() {
        const Users = ({ children }) => (
            <div>
                <h3>Users</h3>
                {children}
            </div>
        );

        const UsersIndex = () => (
            <div>
                <h3>UsersIndex</h3>
            </div>
        );

        const User = ({ params: { id } }) => (
            <div>
                <h3>User {id}</h3>
            </div>
        );

        const About = () => (
            <div>
                <h2>About</h2>
            </div>
        );

        return (
            <Router>
                <Route path="/" component={App} history={browserHistory}>
                    <IndexRoute component={Index}/>
                    <Route path="/about" component={About}/>
                    <Route path="users" component={Users}>
                        <IndexRoute component={UsersIndex}/>
                        <Route path=":id" component={User}/>
                    </Route>
                </Route>
            </Router>);
    }
}