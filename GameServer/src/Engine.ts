import { Ship } from './Ship';
import { PoweredSystem } from './PoweredSystem';

export class Engine extends PoweredSystem {
    get prefix(): string {
        return 'engine';
    }

    // thrust is the speed at which the ship moves
    get thrust(): number {
        return this.ship.effects.sum(`${this.prefix}.thrust`);
    }

    // efficiency rating = the amount of thrust produced per each power
    get efficiency(): number {
        return this.ship.effects.sum(`${this.prefix}.efficiency`);
    }

    public tick() {
        super.tick();

        // consume power, produce thrust and emit
        if (this.ship.reactor.reserve >= this.power) {
            this.ship.reactor.reserve -= this.power;
            var produceThrust = this.power * this.efficiency;
            var produceEmit = this.power * 2;
            this.ship.effects.add(
                'Engine Thrust',
                `${this.prefix}.thrust`,
                produceThrust,
                1
            );
            this.ship.effects.add('Engine Emission', 'emit', produceEmit, 1);
            global.logger.debug(
                `consumed ${this.power} power to produce ${produceThrust} thrust and ${produceEmit} emit, leaving ${this.ship.reactor.reserve} power in the reactor.`
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

    constructor(ship: Ship) {
        super(ship);
        this.power = 2;

        // establish starting effects
        ship.effects.add(
            'Engine Efficiency',
            `${this.prefix}.efficiency`,
            500.0
        );
    }
}
