import { Ship } from './Ship';
import { PoweredSystem } from './PoweredSystem';

export class JumpEngine extends PoweredSystem {
    private _quantum: number = 0.0;

    get prefix(): string {
        return 'jump';
    }

    // efficiency rating = the amount of quantum provided by each power
    get efficiency(): number {
        return this.ship.effects.sum(`${this.prefix}.efficiency`);
    }

    // a certain amount of quantum is required for a jump
    get quantum(): number {
        return this._quantum;
    }
    set quantum(value: number) {
        this._quantum = value;
    }

    public tick() {
        super.tick();

        // consume power, produce quantum
        if (this.ship.reactor.reserve >= this.power) {
            this.ship.reactor.reserve -= this.power;
            var produceQuantum = this.power * this.efficiency;
            global.logger.debug(
                `consumed ${this.power} power to produce ${produceQuantum} quantum, leaving ${this.ship.reactor.reserve} power in the reactor.`
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

    constructor(ship: Ship) {
        super(ship);

        // establish starting effects
        ship.effects.add('Engine Efficiency', `${this.prefix}.efficiency`, 1.0);
    }
}
