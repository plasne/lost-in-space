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
var Reactor = /** @class */ (function (_super) {
    __extends(Reactor, _super);
    function Reactor(ship) {
        var _this = _super.call(this, ship) || this;
        _this._fuel = 1000;
        _this._reserve = 100;
        _this.power = 8;
        // establish starting effects
        ship.effects.add('Reactor Max Fuel', _this.prefix + ".max-fuel", 1000);
        ship.effects.add('Reactor Max Reserve', _this.prefix + ".max-reserve", 1000);
        ship.effects.add('Reactor Efficiency', _this.prefix + ".efficiency", 1.0);
        return _this;
    }
    Object.defineProperty(Reactor.prototype, "prefix", {
        get: function () {
            return 'reactor';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Reactor.prototype, "maxFuel", {
        // maximum fuel
        get: function () {
            return this.ship.effects.sum(this.prefix + ".max-fuel");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Reactor.prototype, "fuel", {
        // current fuel
        get: function () {
            return this._fuel;
        },
        set: function (value) {
            if (value < 0)
                value = 0;
            if (value > this.maxFuel)
                value = this.maxFuel;
            this._fuel = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Reactor.prototype, "maxReserve", {
        // maximum reserve
        get: function () {
            return this.ship.effects.sum(this.prefix + ".max-reserve");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Reactor.prototype, "reserve", {
        // current reserve
        get: function () {
            return this._reserve;
        },
        set: function (value) {
            if (value < 0)
                value = 0;
            if (value > this.maxReserve)
                value = this.maxReserve;
            this._reserve = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Reactor.prototype, "efficiency", {
        // efficiency rating = the amount of power produced per each fuel
        get: function () {
            return this.ship.effects.sum(this.prefix + ".efficiency");
        },
        enumerable: true,
        configurable: true
    });
    Reactor.prototype.tick = function () {
        _super.prototype.tick.call(this);
        // convert fuel to power
        if (this.reserve < this.maxReserve) {
            var consume = this.fuel >= this.power ? this.power : this.fuel;
            var producePower = this.efficiency * consume;
            var produceEmit = 10 * consume;
            this.fuel -= consume;
            this.reserve += producePower;
            this.ship.effects.add('Reactor Emissions', 'emit', produceEmit, 1);
            global.logger.debug("the reactor consumed " + consume + " fuel (" + this.fuel + " remaining) to produce " + producePower + " power and " + produceEmit + " emit, with a total reserve of " + this.reserve + ".");
        }
    };
    return Reactor;
}(PoweredSystem_1.PoweredSystem));
exports.Reactor = Reactor;
