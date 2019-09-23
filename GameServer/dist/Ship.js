"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Effects_1 = require("./Effects");
var Reactor_1 = require("./Reactor");
var Engine_1 = require("./Engine");
var JumpEngine_1 = require("./JumpEngine");
var Helm_1 = require("./Helm");
var Thrusters_1 = require("./Thrusters");
var Ship = /** @class */ (function () {
    function Ship(server) {
        var _this = this;
        this._class = 2;
        this.effects = new Effects_1.Effects();
        this._server = server;
        // instantiate stations
        this.helm = new Helm_1.Helm(this);
        // instantiate systems
        this.reactor = new Reactor_1.Reactor(this);
        this.engine = new Engine_1.Engine(this);
        this.jumpEngine = new JumpEngine_1.JumpEngine(this);
        this.thrusters = new Thrusters_1.Thrusters(this);
        // every 10 seconds: tick()
        setInterval(function () {
            _this.tick();
        }, 1000);
    }
    Object.defineProperty(Ship.prototype, "server", {
        get: function () {
            return this._server;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ship.prototype, "class", {
        get: function () {
            return this._class;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ship.prototype, "emit", {
        get: function () {
            return this.effects.sum('emit') + this.class * 10;
        },
        enumerable: true,
        configurable: true
    });
    Ship.prototype.tick = function () {
        // decrement all effect lifetimes
        this.effects.decrement('lifetime', 1, true);
        // tick the subsystems
        this.reactor.tick();
        this.engine.tick();
        this.jumpEngine.tick();
        this.thrusters.tick();
        // send updates after each tick
        this.helm.toInterface();
    };
    return Ship;
}());
exports.Ship = Ship;
