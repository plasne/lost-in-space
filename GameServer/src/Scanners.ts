import { PoweredSystem } from './PoweredSystem';
import { Feature } from './Feature';

export class TelemetryPayload {
    public id: string = '';
    public posx: number = 0;
    public posy: number = 0;
    public posz: number = 0;
    public rotx: number = 0;
    public roty: number = 0;
    public rotz: number = 0;
    public s2v: string = '';
    public v2s: string = '';
}

// NOTE: the scanners reveal hidden stats
// NOTE: the sensors find objects using emit/detect
export class Scanners extends PoweredSystem {
    // slots contain a Feature, null = vacancy, or undefined = disabled
    public slots: (Feature | null | undefined)[] = [
        null,
        null,
        null,
        null,
        null,
    ];

    get prefix(): string {
        return 'scanners';
    }

    // efficiency rating = the number of active scans that are performed each tick
    get efficiency(): number {
        return global.ship.effects.sum(`${this.prefix}.efficiency`);
    }

    private assignToTrackSlot(feature: Feature) {
        for (let i = 0; i < 5; i++) {
            if (this.slots[i] === null) {
                this.slots[i] = feature;
                global.logger.debug(
                    `feature ${feature.id} added to target slot ${i}.`
                );
                return true;
            }
        }
        return false;
    }

    // check detect vs emit and distance to add or remove targets from tracking
    public track() {
        // find a list of possible targets
        var possible: Feature[] = [];
        if (global.map.zone) {
            for (var feature of global.map.zone.features) {
                feature.calcRange();
                // TODO: of course you would need to check detect, emit, and range
                if (feature.type == 'vessel') {
                    possible.push(feature);
                    global.logger.debug(
                        `possible target of ${feature.id} identified by scanners.`
                    );
                }
            }
        }

        // sort to favor the closest targets
        possible.sort((a, b) => a.range - b.range);

        // remove any damaged slots
        for (let i = 0; i < 5; i++) {
            if (global.ship.effects.sum(`${this.prefix}.slot{i}.disable`) > 0)
                this.slots[i] = undefined;
        }

        // remove anything that is no longer tracked
        for (let i = 0; i < 5; i++) {
            const found = possible.find((x) => x === this.slots[i]);
            if (!found) this.slots[i] = null;
        }

        // add things that need to be tracked
        for (var entry of possible) {
            const found = this.slots.find((x) => x == entry);
            if (!found) {
                if (this.assignToTrackSlot(entry) === false) {
                    return; // no need to continue adding targets
                }
            }
        }
    }

    // there is a small chance with each scan to uncover some hidden statistic
    public scan() {}

    public tick() {
        super.tick();

        // track targets (consider maybe a coorelation with power to light up tracker slots)
        this.track();

        // consume power, produce scans
        if (global.ship.reactor.reserve >= this.power) {
            global.ship.reactor.reserve -= this.power;
            var produceScans = this.power * this.efficiency;
            global.logger.debug(
                `consumed ${this.power} power to produce ${produceScans} scans, leaving ${global.ship.reactor.reserve} power in the reactor.`
            );
            for (let i = 0; i < produceScans; i++) {
                this.scan();
            }
        } else {
            // hard shutdown the sensors
            this.power = 0;
            this.pendingPower = 0;
            global.logger.debug(
                `the scanners were shutdown because there was not enough reserve power in the reactor.`
            );
        }
    }

    constructor() {
        super();

        // establish starting effects
        global.ship.effects.add(
            'Scanner Efficiency',
            `${this.prefix}.efficiency`,
            1.0
        );
    }
}
