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
var JumpEngine = /** @class */ (function (_super) {
    __extends(JumpEngine, _super);
    function JumpEngine() {
        var _this = _super.call(this) || this;
        _this.quantum = 0.0;
        // establish starting effects
        global.ship.effects.add('Jump Engine Efficiency', _this.prefix + ".efficiency", 1.0);
        return _this;
    }
    Object.defineProperty(JumpEngine.prototype, "prefix", {
        get: function () {
            return 'jump';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JumpEngine.prototype, "efficiency", {
        // efficiency rating = the amount of quantum provided by each power
        get: function () {
            return global.ship.effects.sum(this.prefix + ".efficiency");
        },
        enumerable: true,
        configurable: true
    });
    JumpEngine.prototype.tick = function () {
        _super.prototype.tick.call(this);
        // consume power, produce quantum
        if (global.ship.reactor.reserve >= this.power) {
            global.ship.reactor.reserve -= this.power;
            var produceQuantum = this.power * this.efficiency;
            this.quantum += produceQuantum;
            global.logger.debug("consumed " + this.power + " power to produce " + produceQuantum + " quantum, leaving " + global.ship.reactor.reserve + " power in the reactor.");
        }
        else {
            // hard shutdown the jump engine
            this.power = 0;
            this.pendingPower = 0;
            global.logger.debug("the jump engines were shutdown because there was not enough reserve power in the reactor.");
        }
    };
    return JumpEngine;
}(PoweredSystem_1.PoweredSystem));
exports.JumpEngine = JumpEngine;
