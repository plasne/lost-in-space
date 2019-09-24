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
var Action = /** @class */ (function () {
    function Action(ship) {
        this._ship = ship;
    }
    Object.defineProperty(Action.prototype, "ship", {
        get: function () {
            return this._ship;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "isAvailable", {
        get: function () {
            return !this.ship.effects.contains("suppress:" + this.id);
        },
        enumerable: true,
        configurable: true
    });
    Action.prototype.tick = function () { };
    return Action;
}());
exports.Action = Action;
var BoosterAction = /** @class */ (function (_super) {
    __extends(BoosterAction, _super);
    function BoosterAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BoosterAction.prototype, "id", {
        get: function () {
            return 'booster';
        },
        enumerable: true,
        configurable: true
    });
    BoosterAction.prototype.activate = function () {
        if (!this.isAvailable)
            return;
        if (this.ship.reactor.reserve < 50)
            return;
        this.ship.reactor.reserve -= 50;
        this.ship.effects.add('Booster', 'engine.booster', 100000, 6); // on for 1 min
        this.ship.effects.add('Booster Suppression', 'suppress:booster', 1, 30); // reset after 5 min
    };
    return BoosterAction;
}(Action));
exports.BoosterAction = BoosterAction;
