"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var guid_typescript_1 = require("guid-typescript");
var Feature = /** @class */ (function () {
    function Feature() {
        this._range = 0;
        this.id = guid_typescript_1.Guid.create().toString();
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.hx = 0;
        this.hy = 0;
        this.hz = 0;
        this.s2v = '';
        this.v2s = '';
    }
    Object.defineProperty(Feature.prototype, "range", {
        get: function () {
            return this._range;
        },
        enumerable: true,
        configurable: true
    });
    Feature.prototype.calcRange = function () {
        this._range = Math.sqrt(Math.pow(this.x - global.ship.x, 2) +
            Math.pow(this.y - global.ship.y, 2) +
            Math.pow(this.z - global.ship.z, 2));
    };
    Feature.prototype.receiveTelemetry = function (payload) {
        if (this.id === payload.id) {
            this.x = payload.posx;
            this.y = payload.posy;
            this.z = payload.posz;
            this.hx = payload.rotx;
            this.hy = payload.roty;
            this.hz = payload.rotz;
            this.s2v = payload.s2v;
            this.v2s = payload.v2s;
        }
    };
    return Feature;
}());
exports.Feature = Feature;
