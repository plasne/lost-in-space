import { PoweredSystem } from './PoweredSystem';

// NOTE: the scanners reveal hidden stats
// NOTE: the sensors find objects using emit/detect
export class Sensors extends PoweredSystem {
    get prefix(): string {
        return 'sensors';
    }

    // efficiency rating = the amount of detect produced for each power
    get detectEfficiency(): number {
        return global.ship.effects.sum(`${this.prefix}.detect-efficiency`);
    }

    // efficiency rating = the amount of emit produced for each power
    get emitEfficiency(): number {
        return global.ship.effects.sum(`${this.prefix}.emit-efficiency`);
    }

    public tick() {
        super.tick();

        // consume power, produce detect and emit
        if (global.ship.reactor.reserve >= this.power) {
            global.ship.reactor.reserve -= this.power;
            var produceDetect = this.power * this.detectEfficiency;
            global.ship.effects.add(
                'Sensors Detect',
                `detect`,
                produceDetect,
                1
            );
            var produceEmit = this.power * this.emitEfficiency;
            global.ship.effects.add('Sensors Emission', 'emit', produceEmit, 1);
            global.logger.debug(
                `consumed ${this.power} power to produce ${produceDetect} detect and ${produceEmit} emit, leaving ${global.ship.reactor.reserve} power in the reactor.`
            );
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
            'Scanner Detect Efficiency',
            `${this.prefix}.detect-efficiency`,
            10.0
        );
        global.ship.effects.add(
            'Scanner Emit Efficiency',
            `${this.prefix}.emit-efficiency`,
            5.0
        );
    }
}
