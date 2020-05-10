import { PoweredSystem } from './PoweredSystem';

export class Reactor extends PoweredSystem {
    private _fuel: number = 1000;
    private _reserve: number = 100;

    get prefix(): string {
        return 'reactor';
    }

    // maximum fuel
    get maxFuel(): number {
        return global.ship.effects.sum(`${this.prefix}.max-fuel`);
    }

    // current fuel
    get fuel(): number {
        return this._fuel;
    }
    set fuel(value: number) {
        if (value < 0) value = 0;
        if (value > this.maxFuel) value = this.maxFuel;
        this._fuel = value;
    }

    // maximum reserve
    get maxReserve(): number {
        return global.ship.effects.sum(`${this.prefix}.max-reserve`);
    }

    // current reserve
    get reserve(): number {
        return this._reserve;
    }
    set reserve(value: number) {
        if (value < 0) value = 0;
        if (value > this.maxReserve) value = this.maxReserve;
        this._reserve = value;
    }

    // efficiency rating = the amount of power produced per each fuel
    get efficiency(): number {
        return global.ship.effects.sum(`${this.prefix}.efficiency`);
    }

    public tick() {
        super.tick();

        // convert fuel to power
        if (this.reserve < this.maxReserve) {
            var consume = this.fuel >= this.power ? this.power : this.fuel;
            var producePower = this.efficiency * consume;
            var produceEmit = 10 * consume;
            this.fuel -= consume;
            this.reserve += producePower;
            global.ship.effects.add(
                'Reactor Emissions',
                'emit',
                produceEmit,
                1
            );
            global.logger.debug(
                `the reactor consumed ${consume} fuel (${this.fuel} remaining) to produce ${producePower} power and ${produceEmit} emit, with a total reserve of ${this.reserve}.`
            );
        }
    }

    constructor() {
        super();
        this.power = 8;

        // establish starting effects
        global.ship.effects.add(
            'Reactor Max Fuel',
            `${this.prefix}.max-fuel`,
            1000
        );
        global.ship.effects.add(
            'Reactor Max Reserve',
            `${this.prefix}.max-reserve`,
            1000
        );
        global.ship.effects.add(
            'Reactor Efficiency',
            `${this.prefix}.efficiency`,
            1.0
        );
    }
}
