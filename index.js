import { startServer } from './lib/server';
const  httpPort = process.env.port || 3000;
startServer({ httpPort });