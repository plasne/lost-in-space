"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var guid_typescript_1 = require("guid-typescript");
var Planet_1 = require("./Planet");
var Vessel_1 = require("./Vessel");
var Zone = /** @class */ (function () {
    function Zone() {
        this.id = guid_typescript_1.Guid.create().toString();
        this.features = [];
    }
    Zone.prototype.random = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    Zone.prototype.distance = function (a, b) {
        var x = Math.pow(b.x - a.x, 2);
        var y = Math.pow(b.y - a.y, 2);
        var z = Math.pow(b.z - a.z, 2);
        var d = Math.pow(x + y + z, 0.5);
        return d;
    };
    Zone.prototype.generatePlanets = function (count) {
        for (var i = 0; i < count; i++) {
            var planet = new Planet_1.Planet();
            // ensure that the planets are far apart
            var posOK = false;
            while (!posOK) {
                posOK = true;
                planet.position();
                for (var _i = 0, _a = this.features; _i < _a.length; _i++) {
                    var feature = _a[_i];
                    if (this.distance(feature, planet) < 20000)
                        posOK = false;
                }
            }
            // commit
            global.logger.debug("planet " + planet.name + " generated at (" + planet.x + ", " + planet.y + ", " + planet.z + ") in zone " + this.id + ".");
            this.features.push(planet);
        }
    };
    /*
    private generateFeaturesVoid() {
        // don't generate anything
        global.logger.debug(`features "Void" is chosen for zone ${this.id}`);
    }
    */
    Zone.prototype.generateFeaturesLonely = function () {
        // a single planet really far from a sun
        global.logger.debug("features \"Lonely\" is chosen for zone " + this.id);
        this.generatePlanets(1);
    };
    Zone.prototype.generateFeaturesTwins = function () {
        // a 2-planet system
        global.logger.debug("features \"Twins\" is chosen for zone " + this.id);
        this.generatePlanets(2);
    };
    Zone.prototype.generateFeaturesPacked = function () {
        // a 3-planet system
        global.logger.debug("features \"Packed\" is chosen for zone " + this.id);
        this.generatePlanets(3);
    };
    /*
    private generateFeaturesBlackHole() {
        // a black hole sucking in everything
        global.logger.debug(
            `features "Black Hole" is chosen for zone ${this.id}`
        );
    }

    private generateFeaturesBelter() {
        // only an asteroid belt
        global.logger.debug(`features "Belter" is chosen for zone ${this.id}`);
    }

    private generateFeaturesAlderan() {
        // a destroyed planet
        global.logger.debug(`features "Alderan" is chosen for zone ${this.id}`);
    }

    private generateFeaturesNebula() {
        // a nebula that screws with system functions
        global.logger.debug(`features "Nebula" is chosen for zone ${this.id}`);
    }

    private generateFeaturesAnomaly() {
        // an anomaly that screws with system functions
        global.logger.debug(`features "Anomaly" is chosen for zone ${this.id}`);
    }

    private generateFeaturesDerelict() {
        // a ghost ship
        global.logger.debug(
            `features "Derelict" is chosen for zone ${this.id}`
        );
    }

    private generateFeaturesOutpost() {
        // a lonely outpost
        global.logger.debug(`features "Outpost" is chosen for zone ${this.id}`);
    }

    private generateFeaturesMarket() {
        // a bunch of traders
        global.logger.debug(`features "Market" is chosen for zone ${this.id}`);
    }

    private generateFeaturesEmbassy() {
        // a diplomatic station
        global.logger.debug(`features "Embassy" is chosen for zone ${this.id}`);
    }
    */
    Zone.prototype.generateVessels = function (designation, count) {
        if (count === void 0) { count = 1; }
        // generate a vessel and make sure it is away from everything else
        var vessel = new Vessel_1.Vessel(designation);
        var posOK = false;
        while (!posOK) {
            posOK = true;
            vessel.position();
            for (var _i = 0, _a = this.features; _i < _a.length; _i++) {
                var feature = _a[_i];
                if (this.distance(feature, vessel) < 20000)
                    posOK = false;
            }
        }
        global.logger.debug("vessel " + vessel.name + " generated at (" + vessel.x + ", " + vessel.y + ", " + vessel.z + ") in zone " + this.id + ".");
        this.features.push(vessel);
        count--;
        // generate the rest of the vessels nearby
        var x = vessel.x;
        while (count > 0) {
            var next = new Vessel_1.Vessel(designation);
            x += 500;
            next.x = x;
            next.y = vessel.y;
            next.z = vessel.z;
            global.logger.debug("vessel " + next.name + " generated at (" + next.x + ", " + next.y + ", " + next.z + ") in zone " + this.id + ".");
            this.features.push(next);
            count--;
        }
    };
    Zone.prototype.generatePlotAttackWing = function () {
        // a small squadron of grey ships
        global.logger.debug("plot \"Attack Wing\" is chosen for zone " + this.id);
        this.generateVessels('grey-frigate', 3);
    };
    Zone.prototype.generate = function () {
        // this method picks the features, plots, etc. for a new zone
        // generate features
        var featuresRoll = this.random(1, 100);
        if (featuresRoll >= 1 && featuresRoll <= 20)
            this.generateFeaturesLonely();
        if (featuresRoll >= 21 && featuresRoll <= 80)
            this.generateFeaturesTwins();
        if (featuresRoll >= 81 && featuresRoll <= 100)
            this.generateFeaturesPacked();
        // generate plots
        this.generatePlotAttackWing();
    };
    return Zone;
}());
exports.Zone = Zone;
