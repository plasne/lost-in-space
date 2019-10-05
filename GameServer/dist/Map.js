"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ZoneSet_1 = require("./ZoneSet");
var Map = /** @class */ (function () {
    function Map() {
        this._sets = [];
        this._zone = undefined;
    }
    Object.defineProperty(Map.prototype, "sets", {
        // a zone set is comprised of 1-4 zones
        get: function () {
            return this._sets;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Map.prototype, "zone", {
        // the ship's current position
        get: function () {
            return this._zone;
        },
        set: function (value) {
            this._zone = value;
        },
        enumerable: true,
        configurable: true
    });
    // given a zoneId, find the setId
    Map.prototype.findSetId = function (zoneId) {
        for (var _i = 0, _a = this.sets; _i < _a.length; _i++) {
            var zset = _a[_i];
            for (var _b = 0, _c = zset.zones; _b < _c.length; _b++) {
                var zone = _c[_b];
                if (zone.id == zoneId) {
                    return {
                        set: zset,
                        zone: zone
                    };
                }
            }
        }
        return null;
    };
    // moves the position of the ship forward 1 slot
    Map.prototype.advanceTo = function (zoneId) {
        // find the location
        var loc = this.findSetId(zoneId);
        if (!loc)
            throw new Error("zoneId (" + zoneId + ") does not exist.");
        // make sure the zoneset exists for this position and the next
        while (this.sets.length < loc.set.id + 2) {
            var newId = this.sets.length;
            var zset = new ZoneSet_1.ZoneSet(newId);
            zset.generate();
            this.sets.push(zset);
        }
        // advance the ship
        this.zone = loc.zone;
    };
    // generates for the start of the game
    Map.prototype.generate = function () {
        var zset = new ZoneSet_1.ZoneSet(0);
        zset.generate();
        this.sets.push(zset);
        var zoneId = zset.zones[0].id;
        this.advanceTo(zoneId);
    };
    return Map;
}());
exports.Map = Map;
