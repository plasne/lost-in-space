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
var Shields = /** @class */ (function (_super) {
    __extends(Shields, _super);
    function Shields() {
        var _this = _super.call(this) || this;
        _this._fore = 0;
        _this._aft = 0;
        _this._port = 0;
        _this._starboard = 0;
        // establish starting effects
        global.ship.effects.add('Shields Efficiency', _this.prefix + ".efficiency", 1.0);
        return _this;
    }
    Object.defineProperty(Shields.prototype, "prefix", {
        get: function () {
            return 'shields';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shields.prototype, "efficiency", {
        // efficiency rating = the amount of shields generated in each zone per power
        get: function () {
            return global.ship.effects.sum(this.prefix + ".efficiency");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shields.prototype, "maxShields", {
        // maximum shields
        get: function () {
            return global.ship.effects.sum(this.prefix + ".max-shields");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shields.prototype, "fore", {
        // fore-shields
        get: function () {
            return this._fore;
        },
        set: function (value) {
            if (value < 0)
                value = 0;
            if (value > this.maxShields)
                value = this.maxShields;
            this._fore = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shields.prototype, "aft", {
        // aft-shields
        get: function () {
            return this._aft;
        },
        set: function (value) {
            if (value < 0)
                value = 0;
            if (value > this.maxShields)
                value = this.maxShields;
            this._aft = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shields.prototype, "port", {
        // port-shields
        get: function () {
            return this._port;
        },
        set: function (value) {
            if (value < 0)
                value = 0;
            if (value > this.maxShields)
                value = this.maxShields;
            this._port = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shields.prototype, "starboard", {
        // starboard-shields
        get: function () {
            return this._starboard;
        },
        set: function (value) {
            if (value < 0)
                value = 0;
            if (value > this.maxShields)
                value = this.maxShields;
            this._starboard = value;
        },
        enumerable: true,
        configurable: true
    });
    Shields.prototype.tick = function () {
        _super.prototype.tick.call(this);
        // consume power, produce detect and emit
        if (global.ship.reactor.reserve >= this.power) {
            global.ship.reactor.reserve -= this.power;
            var produceShielding = this.power * this.efficiency;
            this.fore += produceShielding;
            this.aft += produceShielding;
            this.port += produceShielding;
            this.starboard += produceShielding;
            global.logger.debug("consumed " + this.power + " power to produce " + produceShielding + " shielding in each zone, leaving " + global.ship.reactor.reserve + " power in the reactor.");
        }
        else {
            // hard shutdown
            this.power = 0;
            this.pendingPower = 0;
            global.logger.debug("shield regeneration was shutdown because there was not enough reserve power in the reactor.");
        }
    };
    return Shields;
}(PoweredSystem_1.PoweredSystem));
exports.Shields = Shields;
