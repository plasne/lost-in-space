"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tags_1 = require("./Tags");
var Effect = /** @class */ (function () {
    function Effect(title) {
        this.tags = new Tags_1.Tags();
        this.title = title;
    }
    return Effect;
}());
exports.Effect = Effect;
