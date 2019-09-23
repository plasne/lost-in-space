"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// includes
require('dotenv').config();
var winston = __importStar(require("winston"));
var tcp_comm_1 = require("tcp-comm");
var Ship_1 = require("./Ship");
// globals
var LOG_LEVEL = process.env.LOG_LEVEL || 'info';
// start logging
var logColors = {
    debug: '\x1b[32m',
    error: '\x1b[31m',
    info: '',
    silly: '\x1b[32m',
    verbose: '\x1b[32m',
    warn: '\x1b[33m' // yellow
};
var transport = new winston.transports.Console({
    format: winston.format.combine(winston.format.timestamp(), winston.format.printf(function (event) {
        var color = logColors[event.level] || '';
        var level = event.level.padStart(7);
        return event.timestamp + " " + color + level + "\u001B[0m: " + event.message;
    }))
});
global.logger = winston.createLogger({
    level: LOG_LEVEL,
    transports: [transport]
});
// startup the network
console.log("LOG_LEVEL is \"" + LOG_LEVEL + "\".");
var server = new tcp_comm_1.TcpServer({
    port: 5000
});
// startup the ship
var ship = new Ship_1.Ship(server);
// handle network events
server
    .on('listen', function () {
    global.logger.info("listening on port " + server.port + "...");
})
    .on('connect', function (client) {
    global.logger.info("hello from " + client.id + "...");
})
    .on('ack', function (msg) {
    global.logger.info("ack for " + msg.c);
})
    .on('error', function (error, module) {
    global.logger.error("there was an error raised in module \"" + module + "\"...");
    global.logger.error(error.stack ? error.stack : error.message);
})
    .on('cmd:helm', function (client, payload) {
    global.logger.info("from: " + client.id + " - " + payload.yaw + " x " + payload.pitch + " @ " + payload.throttle);
    ship.helm.fromInterface(payload);
})
    .on('cmd:telemetry', function (_, payload) {
    var clients = server.clients.filter(function (c) { return c.id != 'mainViewScreen'; });
    global.logger.info("pass on telemetry to " + clients.length + " clients...");
    for (var _i = 0, clients_1 = clients; _i < clients_1.length; _i++) {
        var client = clients_1[_i];
        server.tell(client, 'telemetry', payload);
    }
});
// log settings
global.logger.info("PORT is \"" + server.port + "\".");
// start listening
server.listen();
