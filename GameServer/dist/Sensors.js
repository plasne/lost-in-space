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
var PoweredSystem_1 = require("./PoweredSystem");
// NOTE: the scanners reveal hidden stats
// NOTE: the sensors find objects using emit/detect
var Sensors = /** @class */ (function (_super) {
    __extends(Sensors, _super);
    function Sensors() {
        var _this = _super.call(this) || this;
        // establish starting effects
        global.ship.effects.add('Scanner Detect Efficiency', _this.prefix + ".detect-efficiency", 10.0);
        global.ship.effects.add('Scanner Emit Efficiency', _this.prefix + ".emit-efficiency", 5.0);
        return _this;
    }
    Object.defineProperty(Sensors.prototype, "prefix", {
        get: function () {
            return 'sensors';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sensors.prototype, "detectEfficiency", {
        // efficiency rating = the amount of detect produced for each power
        get: function () {
            return global.ship.effects.sum(this.prefix + ".detect-efficiency");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sensors.prototype, "emitEfficiency", {
        // efficiency rating = the amount of emit produced for each power
        get: function () {
            return global.ship.effects.sum(this.prefix + ".emit-efficiency");
        },
        enumerable: true,
        configurable: true
    });
    Sensors.prototype.tick = function () {
        _super.prototype.tick.call(this);
        // consume power, produce detect and emit
        if (global.ship.reactor.reserve >= this.power) {
            global.ship.reactor.reserve -= this.power;
            var produceDetect = this.power * this.detectEfficiency;
            global.ship.effects.add('Sensors Detect', "detect", produceDetect, 1);
            var produceEmit = this.power * this.emitEfficiency;
            global.ship.effects.add('Sensors Emission', 'emit', produceEmit, 1);
            global.logger.debug("consumed " + this.power + " power to produce " + produceDetect + " detect and " + produceEmit + " emit, leaving " + global.ship.reactor.reserve + " power in the reactor.");
        }
        else {
            // hard shutdown the sensors
            this.power = 0;
            this.pendingPower = 0;
            global.logger.debug("the scanners were shutdown because there was not enough reserve power in the reactor.");
        }
    };
    return Sensors;
}(PoweredSystem_1.PoweredSystem));
exports.Sensors = Sensors;
