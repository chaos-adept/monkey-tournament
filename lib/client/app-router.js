import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRedirect, Link, browserHistory } from 'react-router'

import { App } from './components/app';    
import { Index } from './components/index';
import { Play } from './components/play/play';
import { Login } from './components/login';
import { Profile } from './components/login';
import { createHistory, useBasename } from "history";


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

        const NoMatch = () => (
           <div>
                <h2>not match</h2>
            </div>
         );

        return (
            <Router history={browserHistory}>
                <Route path="/" component={App} >
                    <IndexRedirect to="/game" />
                    <Route path="game" component={Play}/>
                    <Route path="login" component={Login}/>
                    <Route path="*" component={NoMatch}/>
                </Route>

            </Router>);
    }
}