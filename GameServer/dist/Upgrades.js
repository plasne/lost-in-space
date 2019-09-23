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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Upgrades = /** @class */ (function (_super) {
    __extends(Upgrades, _super);
    function Upgrades() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // sum all tags with a specific key across all upgrades
    Upgrades.prototype.sum = function (key) {
        var total = 0;
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var upgrade = _a[_i];
            for (var _b = 0, _c = upgrade.tags; _b < _c.length; _b++) {
                var tag = _c[_b];
                if (tag.key === key)
                    total += tag.value;
            }
        }
        return total;
    };
    Upgrades = __decorate([
        es5ClassFix()
    ], Upgrades);
    return Upgrades;
}(Array));
exports.Upgrades = Upgrades;
function es5ClassFix() {
    return function (target) {
        return /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                var _this = _super.call(this) || this;
                Object.setPrototypeOf(_this, target.prototype);
                return _this;
            }
            return class_1;
        }(target));
    };
}
exports.es5ClassFix = es5ClassFix;
