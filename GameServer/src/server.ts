// includes
require('dotenv').config();
import * as winston from 'winston';
import { IClient, IMessage, TcpServer } from 'tcp-comm';
import { Ship } from './Ship';
import { FromHelmInterface } from './Helm';

// globals
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// start logging
const logColors: {
    [index: string]: string;
} = {
    debug: '\x1b[32m', // green
    error: '\x1b[31m', // red
    info: '', // white
    silly: '\x1b[32m', // green
    verbose: '\x1b[32m', // green
    warn: '\x1b[33m' // yellow
};
const transport = new winston.transports.Console({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(event => {
            const color = logColors[event.level] || '';
            const level = event.level.padStart(7);
            return `${event.timestamp} ${color}${level}\x1b[0m: ${event.message}`;
        })
    )
});
global.logger = winston.createLogger({
    level: LOG_LEVEL,
    transports: [transport]
});

// startup the network
console.log(`LOG_LEVEL is "${LOG_LEVEL}".`);
const server = new TcpServer({
    port: 5000
});

// startup the ship
const ship = new Ship(server);

// handle network events
server
    .on('listen', () => {
        global.logger.info(`listening on port ${server.port}...`);
    })
    .on('connect', (client: IClient) => {
        global.logger.info(`hello from ${client.id}...`);
    })
    .on('ack', (msg: IMessage) => {
        global.logger.info(`ack for ${msg.c}`);
    })
    .on('error', (error: Error, module: string) => {
        global.logger.error(
            `there was an error raised in module "${module}"...`
        );
        global.logger.error(error.stack ? error.stack : error.message);
    })
    .on('cmd:helm', (client: IClient, payload: FromHelmInterface) => {
        global.logger.info(
            `from: ${client.id} - ${payload.yaw} x ${payload.pitch} @ ${payload.throttle}`
        );
        ship.helm.fromInterface(payload);
    })
    .on('cmd:telemetry', (_: IClient, payload: any) => {
        var clients = server.clients.filter(c => c.id != 'mainViewScreen');
        global.logger.info(`pass on telemetry to ${clients.length} clients...`);
        for (var client of clients) {
            server.tell(client, 'telemetry', payload);
        }
    });

// log settings
global.logger.info(`PORT is "${server.port}".`);

// start listening
server.listen();
