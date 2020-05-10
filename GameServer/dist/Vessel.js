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
        _this.classification = '';
        _this.icon = '';
        _this.hull = 0;
        _this.shieldFore = 0;
        _this.shieldAft = 0;
        _this.shieldPort = 0;
        _this.shieldStarboard = 0;
        _this.speed = 0;
        _this.crew = 0;
        _this.hit = 0;
        _this.crit = 0;
        _this.assault = 0;
        _this.evade = 0;
        _this.armor = 0;
        _this.resist = 0;
        _this.emit = 0;
        _this.detect = 0;
        _this.hack = 0;
        _this.hullIsVisible = false;
        _this.shieldForeIsVisible = false;
        _this.shieldAftIsVisible = false;
        _this.shieldPortIsVisible = false;
        _this.shieldStarboardIsVisible = false;
        _this.speedIsVisible = false;
        _this.crewIsVisible = false;
        _this.hitIsVisible = false;
        _this.critIsVisible = false;
        _this.assaultIsVisible = false;
        _this.evadeIsVisible = false;
        _this.armorIsVisible = false;
        _this.resistIsVisible = false;
        _this.emitIsVisible = false;
        _this.detectIsVisible = false;
        _this.hackIsVisible = false;
        _this.type = 'vessel';
        _this.name = generate().spaced;
        _this.designation = designation;
        _this.generateStats();
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
    Vessel.prototype.stats = function () {
        // TODO: remove this
        this.hullIsVisible = true;
        this.shieldForeIsVisible = true;
        this.shieldAftIsVisible = true;
        this.shieldPortIsVisible = true;
        this.shieldStarboardIsVisible = true;
        this.speedIsVisible = true;
        this.crewIsVisible = true;
        this.hitIsVisible = true;
        this.critIsVisible = true;
        this.assaultIsVisible = true;
        this.evadeIsVisible = true;
        this.armorIsVisible = true;
        this.resistIsVisible = true;
        this.emitIsVisible = true;
        this.detectIsVisible = true;
        this.hackIsVisible = true;
        var stats = [];
        stats.push(this.name);
        stats.push(this.classification);
        stats.push(this.icon);
        stats.push(this.v2s);
        stats.push(this.s2v);
        stats.push(this.range.toString());
        stats.push(this.hullIsVisible ? this.hull.toString() : '?');
        stats.push(this.shieldForeIsVisible ? this.shieldFore.toString() : '?');
        stats.push(this.shieldAftIsVisible ? this.shieldAft.toString() : '?');
        stats.push(this.shieldPortIsVisible ? this.shieldPort.toString() : '?');
        stats.push(this.shieldStarboardIsVisible
            ? this.shieldStarboard.toString()
            : '?');
        stats.push(this.speedIsVisible ? this.speed.toString() : '?');
        stats.push(this.crewIsVisible ? this.crew.toString() : '?');
        stats.push(this.hitIsVisible ? this.hit.toString() : '?');
        stats.push(this.critIsVisible ? this.crit.toString() : '?');
        stats.push(this.assaultIsVisible ? this.assault.toString() : '?');
        stats.push(this.evadeIsVisible ? this.evade.toString() : '?');
        stats.push(this.armorIsVisible ? this.armor.toString() : '?');
        stats.push(this.resistIsVisible ? this.resist.toString() : '?');
        stats.push(this.emitIsVisible ? this.emit.toString() : '?');
        stats.push(this.detectIsVisible ? this.detect.toString() : '?');
        stats.push(this.hackIsVisible ? this.hack.toString() : '?');
        return stats.join(',');
    };
    Vessel.prototype.generateStatsGreyFrigate = function () {
        this.classification = 'frigate';
        this.icon = 'ship-gec-frigate';
        this.hull = 75;
        this.shieldFore = 50;
        this.shieldAft = 30;
        this.shieldPort = 30;
        this.shieldStarboard = 30;
        this.speed = 50;
        this.crew = 10;
        this.hit = 90;
        this.crit = 10;
        this.assault = 10;
        this.evade = 20;
        this.armor = 0;
        this.resist = 0;
        this.emit = 40;
        this.detect = 40;
        this.hack = 0;
    };
    Vessel.prototype.generateStats = function () {
        switch (this.designation) {
            case 'grey-frigate':
                this.generateStatsGreyFrigate();
                break;
        }
    };
    return Vessel;
}(Feature_1.Feature));
exports.Vessel = Vessel;
