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
var Feature_1 = require("./Feature");
var Planet = /** @class */ (function (_super) {
    __extends(Planet, _super);
    function Planet() {
        var _this = _super.call(this) || this;
        _this.type = 'planet';
        _this.name = global.naming.greek;
        _this.size = _this.random(2000, 6000);
        _this.material = _this.random(0, 6);
        return _this;
    }
    Planet.prototype.random = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    Planet.prototype.position = function () {
        this.x = this.random(-90000, 90000);
        this.y = this.random(-8000, 8000);
        this.z = this.random(-90000, 90000);
    };
    return Planet;
}(Feature_1.Feature));
exports.Planet = Planet;
