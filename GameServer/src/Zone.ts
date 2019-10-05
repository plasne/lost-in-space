import { Guid } from 'guid-typescript';
import { Feature } from './Feature';
import { Planet } from './Planet';
import { Vessel } from './Vessel';

type point = {
    x: number;
    y: number;
    z: number;
};

export class Zone {
    public id: string = Guid.create().toString();
    public features: Feature[] = [];

    private random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    private distance(a: point | Feature, b: point | Feature) {
        var x = Math.pow(b.x - a.x, 2);
        var y = Math.pow(b.y - a.y, 2);
        var z = Math.pow(b.z - a.z, 2);
        var d = Math.pow(x + y + z, 0.5);
        return d;
    }

    private generatePlanets(count: number) {
        for (var i = 0; i < count; i++) {
            var planet = new Planet();

            // ensure that the planets are far apart
            var posOK = false;
            while (!posOK) {
                posOK = true;
                planet.position();
                for (var feature of this.features) {
                    if (this.distance(feature, planet) < 20000) posOK = false;
                }
            }

            // commit
            global.logger.debug(
                `planet ${planet.name} generated at (${planet.x}, ${planet.y}, ${planet.z}) in zone ${this.id}.`
            );
            this.features.push(planet);
        }
    }

    /*
    private generateFeaturesVoid() {
        // don't generate anything
        global.logger.debug(`features "Void" is chosen for zone ${this.id}`);
    }
    */

    private generateFeaturesLonely() {
        // a single planet really far from a sun
        global.logger.debug(`features "Lonely" is chosen for zone ${this.id}`);
        this.generatePlanets(1);
    }

    private generateFeaturesTwins() {
        // a 2-planet system
        global.logger.debug(`features "Twins" is chosen for zone ${this.id}`);
        this.generatePlanets(2);
    }

    private generateFeaturesPacked() {
        // a 3-planet system
        global.logger.debug(`features "Packed" is chosen for zone ${this.id}`);
        this.generatePlanets(3);
    }

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

    private generateVessels(designation: string, count: number = 1) {
        // generate a vessel and make sure it is away from everything else
        var vessel = new Vessel(designation);
        var posOK = false;
        while (!posOK) {
            posOK = true;
            vessel.position();
            for (var feature of this.features) {
                if (this.distance(feature, vessel) < 20000) posOK = false;
            }
        }
        global.logger.debug(
            `vessel ${vessel.name} generated at (${vessel.x}, ${vessel.y}, ${vessel.z}) in zone ${this.id}.`
        );
        this.features.push(vessel);
        count--;

        // generate the rest of the vessels nearby
        var x = vessel.x;
        while (count > 0) {
            var next = new Vessel(designation);
            x += 500;
            next.x = x;
            next.y = vessel.y;
            next.z = vessel.z;
            global.logger.debug(
                `vessel ${next.name} generated at (${next.x}, ${next.y}, ${next.z}) in zone ${this.id}.`
            );
            this.features.push(next);
            count--;
        }
    }

    private generatePlotAttackWing() {
        // a small squadron of grey ships
        global.logger.debug(`plot "Attack Wing" is chosen for zone ${this.id}`);
        this.generateVessels('grey-frigate', 3);
    }

    public generate() {
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
    }
}
