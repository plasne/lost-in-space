"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Planet_1 = require("./Planet");
var Zone = /** @class */ (function () {
    function Zone() {
        this.features = [];
    }
    Zone.prototype.generate = function () {
        // this method picks the features, plots, etc. for a new zone
        // generate features
        var planet = new Planet_1.Planet();
        planet.position();
        this.features.push(planet);
    };
    return Zone;
}());
exports.Zone = Zone;
