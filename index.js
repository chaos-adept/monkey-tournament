import { startServer } from './lib/server';
const  httpPort = process.env.port || 8080;
startServer({ httpPort });