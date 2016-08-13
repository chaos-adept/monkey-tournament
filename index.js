import { startServer } from './lib/server';


const  httpPort = process.env.port || 3000;
const  httpHost = process.env.host || 'localhost';
startServer({ httpPort, httpHost });