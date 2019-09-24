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
var Effect_1 = require("./Effect");
var Tag_1 = require("./Tag");
var Effects = /** @class */ (function (_super) {
    __extends(Effects, _super);
    function Effects() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // add a simple effect
    Effects.prototype.add = function (title, key, value, lifetime) {
        if (lifetime === void 0) { lifetime = 0; }
        var effect = new Effect_1.Effect(title);
        effect.tags.push(new Tag_1.Tag(key, value));
        if (lifetime > 0)
            effect.tags.push(new Tag_1.Tag('lifetime', lifetime));
        this.push(effect);
        return effect;
    };
    // sum all tags with a specific key across all upgrades
    Effects.prototype.sum = function (key) {
        var total = 0;
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var effect = _a[_i];
            for (var _b = 0, _c = effect.tags; _b < _c.length; _b++) {
                var tag = _c[_b];
                if (tag.key === key)
                    total += tag.value;
            }
        }
        return total;
    };
    // search all effects for the existance of a key
    Effects.prototype.contains = function (key) {
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var effect = _a[_i];
            for (var _b = 0, _c = effect.tags; _b < _c.length; _b++) {
                var tag = _c[_b];
                if (tag.key === key)
                    return true;
            }
        }
        return false;
    };
    // decrement and potentially remove
    Effects.prototype.decrement = function (key, value, removeIfZero) {
        if (removeIfZero === void 0) { removeIfZero = false; }
        // loop in reverse so we can remove while iterating
        var i = this.length;
        while (i--) {
            var effect = this[i];
            for (var _i = 0, _a = effect.tags; _i < _a.length; _i++) {
                var tag = _a[_i];
                if (tag.key === key) {
                    tag.value -= value;
                    if (removeIfZero && tag.value <= 0)
                        this.splice(i, 1);
                }
            }
        }
    };
    Effects = __decorate([
        es5ClassFix()
    ], Effects);
    return Effects;
}(Array));
exports.Effects = Effects;
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
