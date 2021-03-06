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
var Thrusters = /** @class */ (function (_super) {
    __extends(Thrusters, _super);
    function Thrusters() {
        var _this = _super.call(this) || this;
        // establish starting effects
        global.ship.effects.add('Thruster Agility Efficiency', _this.prefix + ".agility-efficiency", 1000.0);
        global.ship.effects.add('Thruster Evade Efficiency', _this.prefix + ".evade-efficiency", 1.0);
        return _this;
    }
    Object.defineProperty(Thrusters.prototype, "prefix", {
        get: function () {
            return 'thrusters';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Thrusters.prototype, "agilityEfficiency", {
        // agility is how maneuverable the ship is
        /*
        get agility(): number {
            return this.ship.effects.sum(`${this.prefix}.agility`);
        }
    
        // evade is how likely the ship is to completely avoid damage
        get evade(): number {
            return this.ship.effects.sum(`${this.prefix}.evade`);
        }
        */
        // efficiency rating = the amount of agility produced per power
        get: function () {
            return global.ship.effects.sum(this.prefix + ".agility-efficiency");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Thrusters.prototype, "evadeEfficiency", {
        // efficiency rating = the amount of evade produced per power
        get: function () {
            return global.ship.effects.sum(this.prefix + ".evade-efficiency");
        },
        enumerable: true,
        configurable: true
    });
    Thrusters.prototype.tick = function () {
        _super.prototype.tick.call(this);
        // consume power, produce agility and evade
        if (global.ship.reactor.reserve >= this.power) {
            global.ship.reactor.reserve -= this.power;
            var produceAgility = this.power * this.agilityEfficiency;
            var produceEvade = this.power * this.evadeEfficiency;
            global.ship.effects.add('Thruster Agility', this.prefix + ".agility", produceAgility, 1);
            global.ship.effects.add('Thruster Evade', this.prefix + ".evade", produceEvade, 1);
            global.logger.debug("consumed " + this.power + " power to produce " + produceAgility + " agility and " + produceEvade + " evade, leaving " + global.ship.reactor.reserve + " power in the reactor.");
        }
        else {
            // hard shutdown the engines
            this.power = 0;
            this.pendingPower = 0;
            global.logger.debug("the engines were shutdown because there was not enough reserve power in the reactor.");
        }
    };
    return Thrusters;
}(PoweredSystem_1.PoweredSystem));
exports.Thrusters = Thrusters;
