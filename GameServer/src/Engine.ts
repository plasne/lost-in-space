import { PoweredSystem } from './PoweredSystem';

export class Engine extends PoweredSystem {
    get prefix(): string {
        return 'engine';
    }

    // efficiency rating = the amount of thrust produced per each power
    get thrustEfficiency(): number {
        return global.ship.effects.sum(`${this.prefix}.thrust-efficiency`);
    }

    // efficiency rating = the amount of emit produced for each power
    get emitEfficiency(): number {
        return global.ship.effects.sum(`${this.prefix}.emit-efficiency`);
    }

    public tick() {
        super.tick();

        // consume power, produce thrust and emit
        if (global.ship.reactor.reserve >= this.power) {
            global.ship.reactor.reserve -= this.power;
            var produceThrust = this.power * this.thrustEfficiency;
            global.ship.effects.add(
                'Engine Thrust',
                `thrust`,
                produceThrust,
                1
            );
            var produceEmit = this.power * this.emitEfficiency;
            global.ship.effects.add('Engine Emission', 'emit', produceEmit, 1);
            global.logger.debug(
                `consumed ${this.power} power to produce ${produceThrust} thrust and ${produceEmit} emit, leaving ${global.ship.reactor.reserve} power in the reactor.`
            );
        } else {
            // hard shutdown the engines
            this.power = 0;
            this.pendingPower = 0;
            global.logger.debug(
                `the engines were shutdown because there was not enough reserve power in the reactor.`
            );
        }
    }

    constructor() {
        super();
        this.power = 2;

        // establish starting effects
        global.ship.effects.add(
            'Engine Thrust Efficiency',
            `${this.prefix}.engine-efficiency`,
            500.0
        );
        global.ship.effects.add(
            'Engine Emission Efficiency',
            `${this.prefix}.emit-efficiency`,
            2.0
        );
    }
}
