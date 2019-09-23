"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PoweredSystem = /** @class */ (function () {
    function PoweredSystem(ship) {
        this._maxPower = 8;
        this._power = 0;
        this._pendingPower = 0;
        this._ship = ship;
    }
    Object.defineProperty(PoweredSystem.prototype, "ship", {
        // reference to the ship
        get: function () {
            return this._ship;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PoweredSystem.prototype, "maxPower", {
        // maximum power
        get: function () {
            return (this.ship.effects.sum(this.prefix + ".max-power") + this._maxPower);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PoweredSystem.prototype, "power", {
        // current power
        get: function () {
            return this._power;
        },
        set: function (value) {
            if (value < 0)
                value = 0;
            if (value > this.maxPower)
                value = this.maxPower;
            this._power = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PoweredSystem.prototype, "pendingPower", {
        // current power
        get: function () {
            return this._pendingPower;
        },
        set: function (value) {
            this._pendingPower = value;
        },
        enumerable: true,
        configurable: true
    });
    PoweredSystem.prototype.tick = function () {
        // convert pending-power into power
        if (this.pendingPower > 0) {
            this.pendingPower--;
            this.power++;
        }
        else if (this.pendingPower < 0) {
            this.pendingPower++;
            this.power--;
        }
    };
    return PoweredSystem;
}());
exports.PoweredSystem = PoweredSystem;
