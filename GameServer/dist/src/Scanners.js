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
var PoweredSystem_1 = require("./PoweredSystem");
var TelemetryPayload = /** @class */ (function () {
    function TelemetryPayload() {
        this.id = '';
        this.posx = 0;
        this.posy = 0;
        this.posz = 0;
        this.rotx = 0;
        this.roty = 0;
        this.rotz = 0;
    }
    return TelemetryPayload;
}());
exports.TelemetryPayload = TelemetryPayload;
// NOTE: the scanners reveal hidden stats
// NOTE: the sensors find objects using emit/detect
var Scanners = /** @class */ (function (_super) {
    __extends(Scanners, _super);
    function Scanners() {
        var _this = _super.call(this) || this;
        // slots contain a Feature, null = vacancy, or undefined = disabled
        _this.slots = [
            null,
            null,
            null,
            null,
            null,
        ];
        // establish starting effects
        global.ship.effects.add('Scanner Efficiency', _this.prefix + ".efficiency", 1.0);
        return _this;
    }
    Object.defineProperty(Scanners.prototype, "prefix", {
        get: function () {
            return 'scanners';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scanners.prototype, "efficiency", {
        // efficiency rating = the number of active scans that are performed each tick
        get: function () {
            return global.ship.effects.sum(this.prefix + ".efficiency");
        },
        enumerable: true,
        configurable: true
    });
    Scanners.prototype.assignToTrackSlot = function (feature) {
        for (var i = 0; i < 5; i++) {
            if (this.slots[i] === null) {
                this.slots[i] = feature;
                global.logger.debug("feature " + feature.id + " added to target slot " + i + ".");
                return true;
            }
        }
        return false;
    };
    // check detect vs emit and distance to add or remove targets from tracking
    Scanners.prototype.track = function () {
        var _this = this;
        // find a list of possible targets
        var possible = [];
        if (global.map.zone) {
            for (var _i = 0, _a = global.map.zone.features; _i < _a.length; _i++) {
                var feature = _a[_i];
                feature.calcRange();
                // TODO: of course you would need to check detect, emit, and range
                if (feature.type == 'vessel') {
                    possible.push(feature);
                    global.logger.debug("possible target of " + feature.id + " identified by scanners.");
                }
            }
        }
        // sort to favor the closest targets
        possible.sort(function (a, b) { return a.range - b.range; });
        // remove any damaged slots
        for (var i = 0; i < 5; i++) {
            if (global.ship.effects.sum(this.prefix + ".slot{i}.disable") > 0)
                this.slots[i] = undefined;
        }
        var _loop_1 = function (i) {
            var found = possible.find(function (x) { return x === _this.slots[i]; });
            if (!found)
                this_1.slots[i] = null;
        };
        var this_1 = this;
        // remove anything that is no longer tracked
        for (var i = 0; i < 5; i++) {
            _loop_1(i);
        }
        // add things that need to be tracked
        for (var _b = 0, possible_1 = possible; _b < possible_1.length; _b++) {
            var entry = possible_1[_b];
            var found = this.slots.find(function (x) { return x == entry; });
            if (!found) {
                if (this.assignToTrackSlot(entry) === false) {
                    return; // no need to continue adding targets
                }
            }
        }
    };
    // there is a small chance with each scan to uncover some hidden statistic
    Scanners.prototype.scan = function () { };
    Scanners.prototype.tick = function () {
        _super.prototype.tick.call(this);
        // track targets (consider maybe a coorelation with power to light up tracker slots)
        this.track();
        // consume power, produce scans
        if (global.ship.reactor.reserve >= this.power) {
            global.ship.reactor.reserve -= this.power;
            var produceScans = this.power * this.efficiency;
            global.logger.debug("consumed " + this.power + " power to produce " + produceScans + " scans, leaving " + global.ship.reactor.reserve + " power in the reactor.");
            for (var i = 0; i < produceScans; i++) {
                this.scan();
            }
        }
        else {
            // hard shutdown the sensors
            this.power = 0;
            this.pendingPower = 0;
            global.logger.debug("the scanners were shutdown because there was not enough reserve power in the reactor.");
        }
    };
    return Scanners;
}(PoweredSystem_1.PoweredSystem));
exports.Scanners = Scanners;
