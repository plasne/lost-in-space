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
    function Engine(ship) {
        var _this = _super.call(this, ship) || this;
        _this.power = 2;
        // establish starting effects
        ship.effects.add('Engine Efficiency', _this.prefix + ".efficiency", 500.0);
        return _this;
    }
    Object.defineProperty(Engine.prototype, "prefix", {
        get: function () {
            return 'engine';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "thrust", {
        // thrust is the speed at which the ship moves
        get: function () {
            return this.ship.effects.sum(this.prefix + ".thrust");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "efficiency", {
        // efficiency rating = the amount of thrust produced per each power
        get: function () {
            return this.ship.effects.sum(this.prefix + ".efficiency");
        },
        enumerable: true,
        configurable: true
    });
    Engine.prototype.tick = function () {
        _super.prototype.tick.call(this);
        // consume power, produce thrust and emit
        if (this.ship.reactor.reserve >= this.power) {
            this.ship.reactor.reserve -= this.power;
            var produceThrust = this.power * this.efficiency;
            var produceEmit = this.power * 2;
            this.ship.effects.add('Engine Thrust', this.prefix + ".thrust", produceThrust, 1);
            this.ship.effects.add('Engine Emission', 'emit', produceEmit, 1);
            global.logger.debug("consumed " + this.power + " power to produce " + produceThrust + " thrust and " + produceEmit + " emit, leaving " + this.ship.reactor.reserve + " power in the reactor.");
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
