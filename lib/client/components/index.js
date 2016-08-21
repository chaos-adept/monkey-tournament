import React from 'react';
import {Stats} from './stats';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
const ACTIVE = { color: 'blue' };

export class Index extends React.Component {
    render(){
        return (
            <div>
                <h2>Index</h2>
                <Stats/>
                {this.props.children}
            </div>
        )
    }

};