"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Effects_1 = require("./Effects");
var Feature_1 = require("./Feature");
var Reactor_1 = require("./Reactor");
var Engine_1 = require("./Engine");
var JumpEngine_1 = require("./JumpEngine");
var Helm_1 = require("./Helm");
var Thrusters_1 = require("./Thrusters");
var Action_1 = require("./Action");
var Scanners_1 = require("./Scanners");
var Sensors_1 = require("./Sensors");
var Tactical_1 = require("./Tactical");
var Weapons_1 = require("./Weapons");
var BattleStations_1 = require("./BattleStations");
var Shields_1 = require("./Shields");
var Ship = /** @class */ (function (_super) {
    __extends(Ship, _super);
    function Ship() {
        var _this = _super.call(this) || this;
        _this._class = 2;
        // effects
        _this.effects = new Effects_1.Effects();
        _this.type = 'ship';
        // NOTE: the startup of some systems require the ability to apply effects, which requires
        //  the ship to be assigned to global.ship
        global.ship = _this;
        // instantiate stations
        _this.helm = new Helm_1.Helm();
        _this.helm.action1 = new Action_1.BoosterAction();
        _this.tactical = new Tactical_1.Tactical();
        // instantiate systems
        _this.reactor = new Reactor_1.Reactor();
        _this.engine = new Engine_1.Engine();
        _this.jumpEngine = new JumpEngine_1.JumpEngine();
        _this.thrusters = new Thrusters_1.Thrusters();
        _this.sensors = new Sensors_1.Sensors();
        _this.scanners = new Scanners_1.Scanners();
        _this.battleStations = new BattleStations_1.BattleStations();
        _this.weapons = new Weapons_1.Weapons();
        _this.shields = new Shields_1.Shields();
        // every 10 seconds: tick()
        setInterval(function () {
            _this.tick();
        }, 10000);
        return _this;
    }
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
    Object.defineProperty(Ship.prototype, "detect", {
        get: function () {
            return this.effects.sum('detect');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ship.prototype, "agility", {
        get: function () {
            return this.effects.sum('agility');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ship.prototype, "thrust", {
        get: function () {
            return this.effects.sum('thrust');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ship.prototype, "speed", {
        get: function () {
            return this.effects.sum('speed');
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
        this.sensors.tick();
        this.scanners.tick();
        this.battleStations.tick();
        this.weapons.tick();
        this.shields.tick();
        // send updates after each tick
        this.helm.toInterface();
    };
    return Ship;
}(Feature_1.Feature));
exports.Ship = Ship;
