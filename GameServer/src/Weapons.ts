import { PoweredSystem } from './PoweredSystem';
import { Card } from './Card';
import { Tag } from './Tag';

export class Weapons extends PoweredSystem {
    private _charge: number = 0;
    private _queue: Card[] = [];

    get prefix(): string {
        return 'weapons';
    }

    // efficiency rating = the amount of quantum provided by each power
    get efficiency(): number {
        return global.ship.effects.sum(`${this.prefix}.efficiency`);
    }

    // maximum charge
    get maxCharge(): number {
        return global.ship.effects.sum(`${this.prefix}.max-charge`);
    }

    // current charge
    get charge(): number {
        return this._charge;
    }
    set charge(value: number) {
        if (value < 0) value = 0;
        if (value > this.maxCharge) value = this.maxCharge;
        this._charge = value;
    }

    private fireEffect(effect: Card) {
        global.logger.debug(`fire ${effect.id}`);
    }

    private fire() {
        // loop in reverse so we can remove while iterating
        var i = this._queue.length;
        while (i--) {
            const effect = this._queue[i];
            const expired = effect.tags.decrement('delay', 1000);
            if (expired) {
                this.fireEffect(effect);
                this._queue.splice(i, 1);
            }
        }

        // do it again in a bit
        setTimeout(() => {
            this.fire();
        }, 1000);
    }

    public enqueue(effect: Card) {
        const clone = effect.clone();
        clone.tags.push(new Tag('delay', '2000'));
        this._queue.push(clone);
    }

    public tick() {
        super.tick();

        // consume power, build charge
        if (global.ship.reactor.reserve >= this.power) {
            global.ship.reactor.reserve -= this.power;
            var produceCharge = this.power * this.efficiency;
            this.charge += produceCharge;
            global.logger.debug(
                `consumed ${this.power} power to produce ${produceCharge} charge, leaving ${global.ship.reactor.reserve} power in the reactor.`
            );
        } else {
            // hard shutdown
            this.power = 0;
            this.pendingPower = 0;
            global.logger.debug(
                `the weapons were shutdown because there was not enough reserve power in the reactor.`
            );
        }

        // start the firing of weapons
        setTimeout(() => {
            this.fire();
        }, 1000);
    }

    constructor() {
        super();

        // establish starting effects
        global.ship.effects.add(
            'Weapons Efficiency',
            `${this.prefix}.efficiency`,
            1.0
        );
    }
}
