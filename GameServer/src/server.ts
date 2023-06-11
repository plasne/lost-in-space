// includes
require('dotenv').config();
import * as winston from 'winston';
import { IClient, IMessage, TcpServer } from 'tcp-comm';
import { Ship } from './Ship';
import { FromHelmInterface } from './Helm';
import { Map } from './Map';
import { Naming } from './Naming';
import { TelemetryPayload } from './Scanners';
import { FromTacticalInterface } from './Tactical';

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
    warn: '\x1b[33m', // yellow
};
const transport = new winston.transports.Console({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((event) => {
            const color = logColors[event.level] || '';
            const level = event.level.padStart(7);
            return `${event.timestamp} ${color}${level}\x1b[0m: ${event.message}`;
        })
    ),
});
global.logger = winston.createLogger({
    level: LOG_LEVEL,
    transports: [transport],
});

// define the generic button click
class ButtonClick {
    public id: string = '';
}

// startup the network
console.log(`LOG_LEVEL is "${LOG_LEVEL}".`);
global.server = new TcpServer({
    port: 5000,
});

// startup
global.random = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
global.naming = new Naming();
global.ship = new Ship();
global.map = new Map();

// handle network events
global.server
    .on('listen', () => {
        global.logger.info(`listening on port ${global.server.port}...`);
    })
    .on('connect', (client: IClient) => {
        global.logger.info(`hello from ${client.id}...`);
    })
    .on('disconnect', (client: IClient) => {
        if (client) {
            global.logger.info(`disconnect from ${client.id}...`);
            global.server.remove(client);
        }
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
    .on('cmd:start', () => {
        global.map.generate();
    })
    .on('cmd:zone?', (client: IClient) => {
        if (global.map.zone) {
            global.server.tell(client, 'zone', global.map.zone);
        }
    })
    .on('cmd:telemetry', (_: IClient, payload: TelemetryPayload) => {
        var clients = global.server.clients.filter(
            (c) => c.id != 'mainViewScreen'
        );
        global.ship.receiveTelemetry(payload);
        if (global.map.zone) {
            for (const feature of global.map.zone.features) {
                feature.receiveTelemetry(payload);
            }
        }
        global.logger.info(`pass on telemetry to ${clients.length} clients...`);
        for (var client of clients) {
            global.server.tell(client, 'telemetry', payload);
        }
    })
    .on('cmd:button', (_: IClient, payload: ButtonClick) => {
        var qualified = payload.id.split('.');
        var module = qualified[0];
        var action = qualified[1];
        global.ship[module].click(action);
    })
    .on('cmd:helm', (client: IClient, payload: FromHelmInterface) => {
        global.logger.info(
            `from: ${client.id} - ${payload.yaw} x ${payload.pitch} @ ${payload.throttle}`
        );
        global.ship.helm.fromInterface(payload);
    })
    .on('cmd:tactical', (client: IClient, payload: FromTacticalInterface) => {
        global.logger.info(`from: ${client.id} - some tactical stuff`);
        global.ship.tactical.fromInterface(payload);
    });

// log settings
global.logger.info(`PORT is "${global.server.port}".`);

// start listening
global.server.listen();
