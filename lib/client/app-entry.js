import 'babel-polyfill';

import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

import GameRouter from './app-router';
import { render } from 'react-dom';
import React from 'react';

render(<GameRouter  />, document.getElementById('react-container'));