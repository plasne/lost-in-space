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
var generate = require('project-name-generator');
var Vessel = /** @class */ (function (_super) {
    __extends(Vessel, _super);
    function Vessel(designation) {
        var _this = _super.call(this) || this;
        _this.type = 'vessel';
        _this.name = generate().spaced;
        _this.designation = designation;
        return _this;
    }
    Vessel.prototype.random = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    Vessel.prototype.position = function () {
        this.x = this.random(-90000, 90000);
        this.y = this.random(-8000, 8000);
        this.z = this.random(-90000, 90000);
    };
    return Vessel;
}(Feature_1.Feature));
exports.Vessel = Vessel;
