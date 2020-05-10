"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Zone_1 = require("./Zone");
var ZoneSet = /** @class */ (function () {
    function ZoneSet(id) {
        this.zones = [];
        this.id = id;
    }
    ZoneSet.prototype.random = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    ZoneSet.prototype.generate = function () {
        // between 1 and 4 zones per set
        var count = this.random(1, 4);
        global.logger.debug("generating " + count + " zones in set " + this.id + "...");
        for (var i = 0; i < count; i++) {
            var zone = new Zone_1.Zone();
            zone.generate();
            this.zones.push(zone);
        }
    };
    return ZoneSet;
}());
exports.ZoneSet = ZoneSet;
