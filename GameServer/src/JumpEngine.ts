import { PoweredSystem } from './PoweredSystem';

export class JumpEngine extends PoweredSystem {
    public quantum: number = 0.0;

    get prefix(): string {
        return 'jump';
    }

    // efficiency rating = the amount of quantum provided by each power
    get efficiency(): number {
        return global.ship.effects.sum(`${this.prefix}.efficiency`);
    }

    public tick() {
        super.tick();

        // consume power, produce quantum
        if (global.ship.reactor.reserve >= this.power) {
            global.ship.reactor.reserve -= this.power;
            var produceQuantum = this.power * this.efficiency;
            this.quantum += produceQuantum;
            global.logger.debug(
                `consumed ${this.power} power to produce ${produceQuantum} quantum, leaving ${global.ship.reactor.reserve} power in the reactor.`
            );
        } else {
            // hard shutdown the jump engine
            this.power = 0;
            this.pendingPower = 0;
            global.logger.debug(
                `the jump engines were shutdown because there was not enough reserve power in the reactor.`
            );
        }
    }

    constructor() {
        super();

        // establish starting effects
        global.ship.effects.add(
            'Jump Engine Efficiency',
            `${this.prefix}.efficiency`,
            1.0
        );
    }
}
