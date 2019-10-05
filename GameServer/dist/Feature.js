"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var guid_typescript_1 = require("guid-typescript");
var Feature = /** @class */ (function () {
    function Feature() {
        this.id = guid_typescript_1.Guid.create().toString();
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
    return Feature;
}());
exports.Feature = Feature;
