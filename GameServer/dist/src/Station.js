"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Station = /** @class */ (function () {
    function Station() {
        this._action1 = undefined;
        this._action2 = undefined;
        this._action3 = undefined;
    }
    Object.defineProperty(Station.prototype, "action1", {
        get: function () {
            return this._action1;
        },
        set: function (value) {
            this._action1 = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Station.prototype, "action2", {
        get: function () {
            return this._action2;
        },
        set: function (value) {
            this._action2 = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Station.prototype, "action3", {
        get: function () {
            return this._action3;
        },
        set: function (value) {
            this._action3 = value;
        },
        enumerable: true,
        configurable: true
    });
    Station.prototype.tick = function () {
        // let the actions do what they do
        if (this.action1)
            this.action1.tick();
        if (this.action2)
            this.action2.tick();
        if (this.action3)
            this.action3.tick();
    };
    Station.prototype.click = function (action) {
        if (action === 'action1' && this.action1)
            this.action1.activate();
        if (action === 'action2' && this.action2)
            this.action2.activate();
        if (action === 'action3' && this.action3)
            this.action3.activate();
    };
    return Station;
}());
exports.Station = Station;
