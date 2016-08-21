import 'babel-polyfill';

import GameRouter from './app-router';
import { render } from 'react-dom';
import React from 'react';

render(<GameRouter  />, document.getElementById('react-container'));