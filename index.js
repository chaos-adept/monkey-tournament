import { startServer } from './lib/server';
const  httpPort = process.env.port || 3001;
startServer({ httpPort });