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
var Tag_1 = require("./Tag");
var Weapons = /** @class */ (function (_super) {
    __extends(Weapons, _super);
    function Weapons() {
        var _this = _super.call(this) || this;
        _this._charge = 0;
        _this._queue = [];
        // establish starting effects
        global.ship.effects.add('Weapons Efficiency', _this.prefix + ".efficiency", 1.0);
        return _this;
    }
    Object.defineProperty(Weapons.prototype, "prefix", {
        get: function () {
            return 'weapons';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Weapons.prototype, "efficiency", {
        // efficiency rating = the amount of quantum provided by each power
        get: function () {
            return global.ship.effects.sum(this.prefix + ".efficiency");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Weapons.prototype, "maxCharge", {
        // maximum charge
        get: function () {
            return global.ship.effects.sum(this.prefix + ".max-charge");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Weapons.prototype, "charge", {
        // current charge
        get: function () {
            return this._charge;
        },
        set: function (value) {
            if (value < 0)
                value = 0;
            if (value > this.maxCharge)
                value = this.maxCharge;
            this._charge = value;
        },
        enumerable: true,
        configurable: true
    });
    Weapons.prototype.fireEffect = function (effect) {
        global.logger.debug("fire " + effect.id);
    };
    Weapons.prototype.fire = function () {
        var _this = this;
        // loop in reverse so we can remove while iterating
        var i = this._queue.length;
        while (i--) {
            var effect = this._queue[i];
            var expired = effect.tags.decrement('delay', 1000);
            if (expired) {
                this.fireEffect(effect);
                this._queue.splice(i, 1);
            }
        }
        // do it again in a bit
        setTimeout(function () {
            _this.fire();
        }, 1000);
    };
    Weapons.prototype.enqueue = function (effect) {
        var clone = effect.clone();
        clone.tags.push(new Tag_1.Tag('delay', '2000'));
        this._queue.push(clone);
    };
    Weapons.prototype.tick = function () {
        var _this = this;
        _super.prototype.tick.call(this);
        // consume power, build charge
        if (global.ship.reactor.reserve >= this.power) {
            global.ship.reactor.reserve -= this.power;
            var produceCharge = this.power * this.efficiency;
            this.charge += produceCharge;
            global.logger.debug("consumed " + this.power + " power to produce " + produceCharge + " charge, leaving " + global.ship.reactor.reserve + " power in the reactor.");
        }
        else {
            // hard shutdown
            this.power = 0;
            this.pendingPower = 0;
            global.logger.debug("the weapons were shutdown because there was not enough reserve power in the reactor.");
        }
        // start the firing of weapons
        setTimeout(function () {
            _this.fire();
        }, 1000);
    };
    return Weapons;
}(PoweredSystem_1.PoweredSystem));
exports.Weapons = Weapons;
