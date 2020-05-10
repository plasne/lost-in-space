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
var Engine = /** @class */ (function (_super) {
    __extends(Engine, _super);
    function Engine() {
        var _this = _super.call(this) || this;
        _this.power = 2;
        // establish starting effects
        global.ship.effects.add('Engine Thrust Efficiency', _this.prefix + ".engine-efficiency", 500.0);
        global.ship.effects.add('Engine Emission Efficiency', _this.prefix + ".emit-efficiency", 2.0);
        return _this;
    }
    Object.defineProperty(Engine.prototype, "prefix", {
        get: function () {
            return 'engine';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "thrustEfficiency", {
        // efficiency rating = the amount of thrust produced per each power
        get: function () {
            return global.ship.effects.sum(this.prefix + ".thrust-efficiency");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "emitEfficiency", {
        // efficiency rating = the amount of emit produced for each power
        get: function () {
            return global.ship.effects.sum(this.prefix + ".emit-efficiency");
        },
        enumerable: true,
        configurable: true
    });
    Engine.prototype.tick = function () {
        _super.prototype.tick.call(this);
        // consume power, produce thrust and emit
        if (global.ship.reactor.reserve >= this.power) {
            global.ship.reactor.reserve -= this.power;
            var produceThrust = this.power * this.thrustEfficiency;
            global.ship.effects.add('Engine Thrust', "thrust", produceThrust, 1);
            var produceEmit = this.power * this.emitEfficiency;
            global.ship.effects.add('Engine Emission', 'emit', produceEmit, 1);
            global.logger.debug("consumed " + this.power + " power to produce " + produceThrust + " thrust and " + produceEmit + " emit, leaving " + global.ship.reactor.reserve + " power in the reactor.");
        }
        else {
            // hard shutdown the engines
            this.power = 0;
            this.pendingPower = 0;
            global.logger.debug("the engines were shutdown because there was not enough reserve power in the reactor.");
        }
    };
    return Engine;
}(PoweredSystem_1.PoweredSystem));
exports.Engine = Engine;
