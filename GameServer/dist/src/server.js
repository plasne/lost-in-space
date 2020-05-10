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
var Map_1 = require("./Map");
var Naming_1 = require("./Naming");
// globals
var LOG_LEVEL = process.env.LOG_LEVEL || 'info';
// start logging
var logColors = {
    debug: '\x1b[32m',
    error: '\x1b[31m',
    info: '',
    silly: '\x1b[32m',
    verbose: '\x1b[32m',
    warn: '\x1b[33m',
};
var transport = new winston.transports.Console({
    format: winston.format.combine(winston.format.timestamp(), winston.format.printf(function (event) {
        var color = logColors[event.level] || '';
        var level = event.level.padStart(7);
        return event.timestamp + " " + color + level + "\u001B[0m: " + event.message;
    })),
});
global.logger = winston.createLogger({
    level: LOG_LEVEL,
    transports: [transport],
});
// define the generic button click
var ButtonClick = /** @class */ (function () {
    function ButtonClick() {
        this.id = '';
    }
    return ButtonClick;
}());
// startup the network
//console.log(`LOG_LEVEL is "${LOG_LEVEL}".`);
console.log('when');
global.server = new tcp_comm_1.TcpServer({
    port: 5000,
});
// startup
global.naming = new Naming_1.Naming();
global.ship = new Ship_1.Ship();
global.map = new Map_1.Map();
// handle network events
global.server
    .on('listen', function () {
    global.logger.info("listening on port " + global.server.port + "...");
})
    .on('connect', function (client) {
    global.logger.info("hello from " + client.id + "...");
})
    .on('disconnect', function (client) {
    if (client) {
        global.logger.info("disconnect from " + client.id + "...");
        global.server.remove(client);
    }
})
    .on('ack', function (msg) {
    global.logger.info("ack for " + msg.c);
})
    .on('error', function (error, module) {
    global.logger.error("there was an error raised in module \"" + module + "\"...");
    global.logger.error(error.stack ? error.stack : error.message);
})
    .on('cmd:start', function () {
    global.map.generate();
})
    .on('cmd:zone?', function (client) {
    if (global.map.zone) {
        global.server.tell(client, 'zone', global.map.zone);
    }
})
    .on('cmd:telemetry', function (_, payload) {
    var clients = global.server.clients.filter(function (c) { return c.id != 'mainViewScreen'; });
    global.ship.receiveTelemetry(payload);
    if (global.map.zone) {
        for (var _i = 0, _a = global.map.zone.features; _i < _a.length; _i++) {
            var feature = _a[_i];
            feature.receiveTelemetry(payload);
        }
    }
    global.logger.info("pass on telemetry to " + clients.length + " clients...");
    for (var _b = 0, clients_1 = clients; _b < clients_1.length; _b++) {
        var client = clients_1[_b];
        global.server.tell(client, 'telemetry', payload);
    }
})
    .on('cmd:button', function (_, payload) {
    var qualified = payload.id.split('.');
    var module = qualified[0];
    var action = qualified[1];
    global.ship[module].click(action);
})
    .on('cmd:helm', function (client, payload) {
    global.logger.info("from: " + client.id + " - " + payload.yaw + " x " + payload.pitch + " @ " + payload.throttle);
    global.ship.helm.fromInterface(payload);
})
    .on('cmd:tactical', function (client, payload) {
    global.logger.info("from: " + client.id + " - some tactical stuff");
    global.ship.tactical.fromInterface(payload);
});
// log settings
global.logger.info("PORT is \"" + global.server.port + "\".");
// start listening
global.server.listen();
