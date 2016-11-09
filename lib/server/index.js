require('babel-polyfill');

import { startServer } from './server';


const  httpPort = process.env.port || 80;
const  httpHost = process.env.host || 'localhost';
startServer({ httpPort, httpHost });